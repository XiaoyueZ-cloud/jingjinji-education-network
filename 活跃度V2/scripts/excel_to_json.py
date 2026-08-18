"""将主结果 Excel 转为网页所需的两个 JSON；运行：python excel_to_json.py 主结果.xlsx"""
import json, sys
from pathlib import Path
import pandas as pd

CATEGORIES = ['资源共享', '人才培养', '办学合作', '产教科教融合', '治理机制']
ROOT = Path(__file__).resolve().parents[1]
def pick(row, *names, default=''):
    for name in names:
        value = row.get(name, None)
        if value is not None and not pd.isna(value):
            return str(value)
    return default
def clean_month(value):
    date = pd.to_datetime(value, errors='coerce')
    return date.strftime('%Y-%m') if not pd.isna(date) else None
def main(excel_path):
    books = pd.ExcelFile(excel_path)
    # 此结果文件的五张表及字段顺序固定；统一成前端字段，避免系统编码影响中文列名识别。
    unique = pd.read_excel(books, sheet_name=0).iloc[:, [10, 12, 4, 6, 9, 3]].copy()
    unique.columns = ['eventId', 'month', 'eventName', 'subject', 'region', 'source']
    score = pd.read_excel(books, sheet_name=1).iloc[:, :6].copy()
    score.columns = ['eventId', 'month', 'category', 'score', 'subcategory', 'reason']
    category_monthly = pd.read_excel(books, sheet_name=2).iloc[:, :3].copy()
    category_monthly.columns = ['month', 'category', 'score']
    total_monthly = pd.read_excel(books, sheet_name=3).iloc[:, :2].copy()
    total_monthly.columns = ['month', 'total']
    score['month'] = score['month'].map(clean_month); unique['month'] = unique['month'].map(clean_month)
    score = score[score['month'].between('2023-01', '2026-07')].copy()
    unique = unique[unique['month'].between('2023-01', '2026-07')].copy()
    score['score'] = pd.to_numeric(score['score'], errors='coerce').fillna(0)
    months = pd.period_range('2023-01', '2026-07', freq='M').astype(str)
    grouped = score.groupby(['month','category'], as_index=False)['score'].sum()
    monthly = []
    for month in months:
        cats = {c: float(grouped.loc[(grouped['month']==month)&(grouped['category']==c),'score'].sum()) for c in CATEGORIES}
        monthly.append({'month':month, 'categories':cats, 'total':sum(cats.values())})
    details = []
    for event_id, group in score.groupby('eventId', dropna=True):
        matches = unique[unique['eventId'].astype(str)==str(event_id)]
        base = matches.iloc[0] if not matches.empty else pd.Series(dtype=object)
        details.append({'eventId':str(event_id),'month':group['month'].iloc[0], 'eventName':pick(base, 'eventName', default='未命名事件'), 'subject':pick(base, 'subject'), 'region':pick(base, 'region'), 'source':pick(base, 'source'), 'scores':[{'category':str(r['category']),'subcategory':pick(r, 'subcategory'),'score':float(r['score']),'reason':pick(r, 'reason')} for _,r in group.iterrows()]})
    out = ROOT/'data'; out.mkdir(exist_ok=True)
    (out/'monthly_summary.json').write_text(json.dumps(monthly,ensure_ascii=False,indent=2),encoding='utf-8')
    (out/'event_details.json').write_text(json.dumps(details,ensure_ascii=False,indent=2),encoding='utf-8')
    (out/'embedded_activity_data.js').write_text('window.EMBEDDED_ACTIVITY_DATA = '+json.dumps({'monthly': monthly, 'events': details},ensure_ascii=False)+';\n',encoding='utf-8')
    category_monthly['month'] = category_monthly['month'].map(clean_month)
    total_monthly['month'] = total_monthly['month'].map(clean_month)
    category_monthly = category_monthly[category_monthly['month'].between('2023-01', '2026-07')].copy()
    total_monthly = total_monthly[total_monthly['month'].between('2023-01', '2026-07')].copy()
    category_monthly['score'] = pd.to_numeric(category_monthly['score'], errors='coerce').fillna(0)
    total_monthly['total'] = pd.to_numeric(total_monthly['total'], errors='coerce').fillna(0)
    expected_categories = {(r['month'], r['category']): r['score'] for _, r in category_monthly.iterrows()}
    category_errors = sum(abs(expected_categories.get((r['month'],r['category']), 0)-r['score']) > 1e-8 for _,r in grouped.iterrows())
    expected_totals = dict(zip(total_monthly['month'], total_monthly['total']))
    total_errors = sum(abs(expected_totals.get(r['month'], 0)-r['total']) > 1e-8 for r in monthly)
    print(f'已写入 {len(monthly)} 个月份、{len(details)} 个事件。分类核验差异：{category_errors}；总分核验差异：{total_errors}。')
if __name__ == '__main__': main(Path(sys.argv[1]))
