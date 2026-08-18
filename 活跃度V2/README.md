# 月度活跃度动态演变 V2

V2 将五个协同维度改为直线分段连接，取消折线平滑和每月节点，以提高多维趋势的可读性。

双击 `index.html` 可以直接查看 2023-01 至 2026-07 的完整虚拟演示数据。若在此目录运行 `python -m http.server 8000`，网页会优先读取 `data/` 下的 JSON。

未来收到 Excel 后，安装 `pandas openpyxl`，运行：

```powershell
python scripts/excel_to_json.py "主结果.xlsx"
```

它会覆盖 `data/monthly_summary.json` 与 `data/event_details.json`，页面代码无需修改。Excel 中需包含“唯一事件”和“事件类别计分”工作表；脚本目前按设计说明的字段名读取数据，并会保留缺失月份为 0。
