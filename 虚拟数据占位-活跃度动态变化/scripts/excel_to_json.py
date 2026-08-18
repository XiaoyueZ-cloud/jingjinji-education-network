"""将主结果 Excel 转为网页所需的两个 JSON；运行：python excel_to_json.py 主结果.xlsx"""
import json, sys
from pathlib import Path
import pandas as pd

CATEGORIES = ['资源共享', '人才培养', '办学合作', '产教科教融合', '治理机制']
ROOT = Path(__file__).resolve().parents[1]
def clean_month(value):
    date = pd.to_datetime(value, errors='coerce')
    return date.strftime('%Y-%m') if not pd.isna(date) else str(value)[:7]
def main(excel_path):
    books = pd.ExcelFile(excel_path)
    score = pd.read_excel(books, '事件类别计分'); unique = pd.read_excel(books, '唯一事件')
    score['年月'] = score['年月'].map(clean_month); unique['年月'] = unique['年月'].map(clean_month)
    score['得分'] = pd.to_numeric(score['得分'], errors='coerce').fillna(0)
    months = pd.period_range(score['年月'].min(), score['年月'].max(), freq='M').astype(str)
    grouped = score.groupby(['年月','协同内容'], as_index=False)['得分'].sum()
    monthly = []
    for month in months:
        cats = {c: float(grouped.loc[(grouped['年月']==month)&(grouped['协同内容']==c),'得分'].sum()) for c in CATEGORIES}
        monthly.append({'month':month, 'categories':cats, 'total':sum(cats.values())})
    details = []
    for event_id, group in score.groupby('事件ID', dropna=True):
        base = unique[unique['事件ID'].astype(str)==str(event_id)].iloc[0] if (unique['事件ID'].astype(str)==str(event_id)).any() else {}
        details.append({'eventId':str(event_id),'month':group['年月'].iloc[0], 'eventName':str(base.get('事件名称','未命名事件')), 'subject':str(base.get('主体','')), 'region':str(base.get('地区','')), 'source':str(base.get('来源','')), 'scores':[{'category':str(r['协同内容']),'subcategory':str(r.get('二级分类','')),'score':float(r['得分']),'reason':str(r.get('赋分依据',''))} for _,r in group.iterrows()]})
    out = ROOT/'data'; out.mkdir(exist_ok=True)
    (out/'monthly_summary.json').write_text(json.dumps(monthly,ensure_ascii=False,indent=2),encoding='utf-8')
    (out/'event_details.json').write_text(json.dumps(details,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'已写入 {len(monthly)} 个月份、{len(details)} 个事件。')
if __name__ == '__main__': main(Path(sys.argv[1]))
