/* =====================================================================
 * 一建机电 · 章节思维导图数据（纵向树）
 * 挂载于 window.YJ_DATA.mindmaps
 * 节点：{name, tag:"root|branch|concept|formula", detail?, children?}
 * formula 节点显示公式/关键数据（金色高亮），其余为概念节点
 * ===================================================================== */
window.YJ_DATA = window.YJ_DATA || {};

YJ_DATA.mindmaps = [
{code:"1H411010", title:"机电工程常用材料", root:"常用材料", children:[
 {name:"金属材料", tag:"branch", children:[
   {name:"碳素结构钢", tag:"concept", detail:"Q235/Q275 建筑常用", children:[
     {name:"Q = 屈服强度下限", tag:"formula", detail:"Q235 → 235MPa"},
     {name:"Q460 鸟巢用钢", tag:"concept"}]},
   {name:"低合金结构钢", tag:"concept", detail:"合金总量<5%", children:[
     {name:"Q345(16Mn)/Q390/Q420/Q460", tag:"formula", detail:"<5%"}]},
   {name:"有色金属", tag:"concept", children:[
     {name:"重金属 >4500kg/m³", tag:"formula", detail:"铜锌镍"},
     {name:"轻金属 <4500kg/m³", tag:"formula", detail:"铝镁钛"}]}]},
 {name:"非金属材料", tag:"branch", children:[
   {name:"酚醛复合板", tag:"concept", detail:"中低压空调·潮湿可用"},
   {name:"聚氨酯复合板", tag:"concept", detail:"洁净·防排烟"},
   {name:"玻璃纤维板", tag:"concept", detail:"中低压·负压"}]},
 {name:"母线槽", tag:"branch", children:[
   {name:"空气型 不能垂直装", tag:"concept", detail:"烟囱效应"},
   {name:"紧密型 可垂直装", tag:"concept", detail:"体积小"},
   {name:"高强度型 大跨度", tag:"concept"}]}]},

{code:"1H411020", title:"机电工程常用工程设备", root:"工程设备", children:[
 {name:"泵", tag:"branch", children:[
   {name:"叶片泵", tag:"concept", detail:"离心/轴流/混流"},
   {name:"容积泵", tag:"concept", detail:"往复/回转"}]},
 {name:"风机", tag:"branch", children:[
   {name:"容积式", tag:"concept", detail:"往复/回转"},
   {name:"透平式", tag:"concept", detail:"离心/轴流/混流/横流"}]},
 {name:"压缩机", tag:"branch", children:[
   {name:"低压 <1.0MPa", tag:"formula"},
   {name:"中压 1.0~10MPa", tag:"formula"},
   {name:"高压 10~100MPa", tag:"formula"},
   {name:"超高压 >100MPa", tag:"formula"}]},
 {name:"变压器·互感器", tag:"branch", children:[
   {name:"油浸/干式", tag:"concept"},
   {name:"电压互感器 →100V", tag:"formula"},
   {name:"电流互感器 →5A(1A)", tag:"formula"}]}]},

{code:"1H412010", title:"测量技术", root:"测量技术", children:[
 {name:"高程测量", tag:"branch", children:[
   {name:"水准测量(几何水准)", tag:"concept"},
   {name:"三角高程", tag:"concept"},
   {name:"气压高程", tag:"concept"},
   {name:"基准点：永久/临时", tag:"concept", detail:"深埋/浅埋"}]},
 {name:"基准线与定位", tag:"branch", children:[
   {name:"按工艺布置图+土建轴线", tag:"concept", detail:"柱中心线"},
   {name:"纵横中心线定位", tag:"concept"}]},
 {name:"激光测量仪器", tag:"branch", children:[
   {name:"准直仪→同心度/直线度", tag:"concept"},
   {name:"经纬仪→大角俯仰", tag:"concept"},
   {name:"水准仪→高程", tag:"concept"},
   {name:"平面仪→水平面", tag:"concept"}]},
 {name:"沉降观测", tag:"branch", children:[
   {name:"二等水准测量", tag:"concept"},
   {name:"基础四角/沉降缝两侧", tag:"concept"}]}]},

{code:"1H412020", title:"起重技术", root:"起重技术", children:[
 {name:"吊装计算载荷", tag:"formula", detail:"Qj=k1×k2×Q", children:[
   {name:"k1 动载荷系数 = 1.1", tag:"formula"},
   {name:"k2 不均衡载荷系数 1.1~1.25", tag:"formula"},
   {name:"Q = 设备+索具重量", tag:"concept"}]},
 {name:"钢丝绳安全系数", tag:"branch", children:[
   {name:"拖拉绳 ≥3.5", tag:"formula"},
   {name:"卷扬机走绳 ≥5", tag:"formula"},
   {name:"捆绑绳扣 ≥6", tag:"formula"},
   {name:"系挂绳扣 ≥5", tag:"formula"},
   {name:"载人吊篮 ≥14", tag:"formula"}]},
 {name:"流动式起重机", tag:"branch", children:[
   {name:"汽车吊/履带吊/轮胎吊", tag:"concept"},
   {name:"验算：起重量·幅度·臂长", tag:"concept"},
   {name:"地基承载力", tag:"concept"}]},
 {name:"专家论证条件", tag:"formula", detail:"≥100kN 或 ≥300kN", children:[
   {name:"单件起吊≥100kN", tag:"formula"},
   {name:"起重量≥300kN", tag:"formula"},
   {name:"总高≥200m / 总跨≥70m", tag:"formula"}]},
 {name:"地锚", tag:"branch", children:[
   {name:"全埋/半埋/活动式", tag:"concept"},
   {name:"利用建筑物", tag:"concept"},
   {name:"抗拉拔试验", tag:"concept"}]}]},

{code:"1H412030", title:"焊接技术", root:"焊接技术", children:[
 {name:"焊接方法", tag:"branch", children:[
   {name:"电弧焊：焊条/埋弧", tag:"concept"},
   {name:"气体保护焊：TIG·MIG/MAG", tag:"concept"},
   {name:"电渣焊 / 气焊", tag:"concept"}]},
 {name:"TIG适用范围", tag:"branch", children:[
   {name:"适用：钢/镍/钛", tag:"concept"},
   {name:"不适用：铅锌低熔点", tag:"concept"}]},
 {name:"应力变形控制", tag:"branch", children:[
   {name:"对称焊·反变形法", tag:"concept"},
   {name:"预留收缩余量·预热", tag:"concept"},
   {name:"层间控温·焊后锤击·消氢", tag:"concept"}]},
 {name:"焊后检验", tag:"branch", children:[
   {name:"RT 射线→体积型缺陷", tag:"formula"},
   {name:"UT 超声→面积型缺陷", tag:"formula"},
   {name:"MT 磁粉→表面/近表面铁磁", tag:"formula"},
   {name:"PT 渗透→表面开口", tag:"formula"}]},
 {name:"腐蚀分类", tag:"branch", children:[
   {name:"局部腐蚀：点蚀/缝隙/电偶/晶间/选择性", tag:"concept"},
   {name:"均匀腐蚀→全面腐蚀", tag:"concept"}]}]},

{code:"1H413010", title:"机械设备安装", root:"机械设备安装", children:[
 {name:"设备基础", tag:"branch", children:[
   {name:"素混凝土(荷载小)", tag:"concept"},
   {name:"钢筋混凝土(荷载大·动载)", tag:"concept"},
   {name:"垫层(简易)/强夯(地基)", tag:"concept"}]},
 {name:"地脚螺栓", tag:"branch", children:[
   {name:"固定式：无振动小设备", tag:"concept"},
   {name:"活动式：强振重设备", tag:"concept"},
   {name:"胀锚式：无预留孔", tag:"concept"},
   {name:"预埋式", tag:"concept"}]},
 {name:"垫铁", tag:"branch", children:[
   {name:"每组 ≤5块", tag:"formula"},
   {name:"厚下薄上·调平后点焊", tag:"concept"},
   {name:"坐浆法→高精度设备", tag:"concept"}]},
 {name:"安装精度", tag:"branch", children:[
   {name:"定位：中心线/标高/水平度", tag:"concept"},
   {name:"装配：配合间隙/过盈量", tag:"concept"},
   {name:"运动副精度", tag:"concept"}]}]},

{code:"1H413020", title:"电气工程安装", root:"电气工程安装", children:[
 {name:"变压器安装", tag:"branch", children:[
   {name:"运输倾斜 ≤15°", tag:"formula"},
   {name:"充气压力 0.01~0.03MPa", tag:"formula"},
   {name:"就位核对铭牌与附件", tag:"concept"}]},
 {name:"高压开关柜五防", tag:"branch", children:[
   {name:"防带负荷分合隔离开关", tag:"concept"},
   {name:"防误分合断路器", tag:"concept"},
   {name:"防带电挂地线", tag:"concept"},
   {name:"防带地线合闸", tag:"concept"},
   {name:"防误入带电间隔", tag:"concept"}]},
 {name:"母线安装", tag:"branch", children:[
   {name:"相序色：黄A绿B红C", tag:"formula"},
   {name:"连接螺栓扭矩", tag:"concept"}]},
 {name:"接地与电缆", tag:"branch", children:[
   {name:"接地体埋深 ≥0.6m", tag:"formula"},
   {name:"直埋电缆 ≥0.7m·穿管", tag:"formula"},
   {name:"敷设前1000V兆欧表测试", tag:"concept"}]}]},

{code:"1H413030", title:"工业管道工程施工", root:"工业管道", children:[
 {name:"压力试验", tag:"branch", children:[
   {name:"液压 = 1.5×设计压力", tag:"formula"},
   {name:"气压 = 1.15×设计压力", tag:"formula"},
   {name:"真空管道 0.2MPa", tag:"formula"},
   {name:"压力表 ≥2块·精度≥1.6级", tag:"formula"}]},
 {name:"泄漏性试验", tag:"branch", children:[
   {name:"极度/高度危害+可燃介质", tag:"concept"},
   {name:"压力试验合格后→查填料函/法兰", tag:"concept"},
   {name:"发泡剂检漏", tag:"concept"}]},
 {name:"吹扫清洗", tag:"branch", children:[
   {name:"蒸汽吹扫 ≥30m/s", tag:"formula"},
   {name:"水冲洗 ≥1.5m/s", tag:"formula"},
   {name:"吹扫前暖管排水", tag:"concept"}]},
 {name:"支架与阀门", tag:"branch", children:[
   {name:"补偿器两侧支架偏心设(热伸长向)", tag:"concept"},
   {name:"安全阀铅封·整定压力校验", tag:"concept"},
   {name:"止回阀方向正确", tag:"concept"}]}]},

{code:"1H413040", title:"静置设备及金属结构", root:"静置设备·钢结构", children:[
 {name:"压力容器分级", tag:"formula", children:[
   {name:"低压 0.1~1.6MPa", tag:"formula"},
   {name:"中压 1.6~10MPa", tag:"formula"},
   {name:"高压 10~100MPa", tag:"formula"},
   {name:"超高压 >100MPa", tag:"formula"}]},
 {name:"塔器安装", tag:"branch", children:[
   {name:"分段组对·整体吊装", tag:"concept"},
   {name:"垂直度找正·地脚螺栓紧固", tag:"concept"}]},
 {name:"钢结构连接", tag:"branch", children:[
   {name:"高强螺栓：初拧+终拧", tag:"formula"},
   {name:"终拧以梅花头拧断为准", tag:"concept"},
   {name:"禁止气割扩孔", tag:"concept"},
   {name:"摩擦面抗滑移系数试验", tag:"concept"}]},
 {name:"焊接顺序", tag:"branch", children:[
   {name:"先定位焊后对称焊", tag:"concept"},
   {name:"拱顶罐：先中幅板后边缘板", tag:"concept"}]}]},

{code:"1H413050", title:"发电设备安装", root:"发电设备", children:[
 {name:"汽轮机", tag:"branch", children:[
   {name:"转子穿装：滑道/直接吊装/专用工具", tag:"concept"},
   {name:"找正：轴系对中", tag:"concept"}]},
 {name:"发电机", tag:"branch", children:[
   {name:"穿转子后→气密/氢冷系统", tag:"concept"},
   {name:"定子就位·端盖封闭", tag:"concept"}]},
 {name:"锅炉", tag:"branch", children:[
   {name:"可靠性指标：连续运行小时/可用率/事故率", tag:"concept"},
   {name:"水压试验/烘炉/煮炉", tag:"concept"}]},
 {name:"凝汽器", tag:"branch", children:[
   {name:"灌水试验保持 24h", tag:"formula"},
   {name:"无渗漏合格", tag:"concept"}]},
 {name:"风电·光伏", tag:"branch", children:[
   {name:"塔筒分段吊装·螺栓拉伸器", tag:"concept"},
   {name:"组件朝向倾角按设计·汇流箱接线", tag:"concept"}]}]},

{code:"1H413060", title:"自动化仪表", root:"自动化仪表", children:[
 {name:"仪表调试", tag:"branch", children:[
   {name:"单体校验 全数进行", tag:"concept"},
   {name:"回路调试按设计", tag:"concept"},
   {name:"联锁系统试验", tag:"concept"}]},
 {name:"温度仪表", tag:"branch", children:[
   {name:"插入深度·保护套管", tag:"concept"},
   {name:"不得垂直介质流向", tag:"concept"}]},
 {name:"压力表", tag:"branch", children:[
   {name:"量程 1.5~2倍工作压力", tag:"formula"},
   {name:"取源部件位置·隔离", tag:"concept"}]},
 {name:"气动信号管道", tag:"branch", children:[
   {name:"卡套式 / 气焊连接", tag:"formula"},
   {name:"禁螺纹连接(易漏)", tag:"concept"}]}]},

{code:"1H413070", title:"防腐蚀工程", root:"防腐蚀", children:[
 {name:"表面处理等级", tag:"formula", children:[
   {name:"喷射除锈 Sa2.5 / Sa3", tag:"formula"},
   {name:"手工除锈 St2 / St3", tag:"formula"},
   {name:"Sa2.5 呈金属本色", tag:"concept"}]},
 {name:"电化学保护", tag:"branch", children:[
   {name:"牺牲阳极法：镁铝锌阳极", tag:"concept"},
   {name:"外加电流法(阴极保护)", tag:"concept"}]},
 {name:"涂层施工", tag:"branch", children:[
   {name:"底漆面漆配套·每道厚度", tag:"concept"},
   {name:"环境温湿度要求", tag:"concept"},
   {name:"热喷涂金属涂层", tag:"concept"}]},
 {name:"衬里", tag:"branch", children:[
   {name:"橡胶/玻璃钢/搪铅衬里", tag:"concept"}]}]},

{code:"1H413080", title:"绝热工程", root:"绝热工程", children:[
 {name:"绝热层施工", tag:"branch", children:[
   {name:"捆扎法 间距300~400mm", tag:"formula"},
   {name:"粘贴法/浇注法/喷涂法", tag:"concept"}]},
 {name:"保温与保冷", tag:"branch", children:[
   {name:"保冷必设防潮层(防结露)", tag:"concept"},
   {name:"外设保护层", tag:"concept"}]},
 {name:"伸缩缝", tag:"branch", children:[
   {name:"按介质温度设置", tag:"concept"},
   {name:"填塞软质材料", tag:"concept"}]},
 {name:"常用材料", tag:"branch", children:[
   {name:"岩棉/玻璃棉/聚氨酯/硅酸铝纤维", tag:"concept"}]}]},

{code:"1H413090", title:"工业炉窑", root:"工业炉窑", children:[
 {name:"炉窑分类", tag:"branch", children:[
   {name:"动态炉窑：回转窑", tag:"concept"},
   {name:"静态炉窑：高炉/加热炉", tag:"concept"}]},
 {name:"砌筑要求", tag:"branch", children:[
   {name:"灰缝厚度按砖型部位", tag:"concept"},
   {name:"膨胀缝留设", tag:"concept"},
   {name:"拱脚→拱顶砌筑顺序", tag:"concept"}]},
 {name:"烘炉", tag:"branch", children:[
   {name:"按烘炉曲线升温", tag:"concept"},
   {name:"烘炉前查干燥与热电偶", tag:"concept"}]},
 {name:"耐火材料", tag:"branch", children:[
   {name:"不定形：浇注料/捣打料", tag:"concept"},
   {name:"定形：耐火砖", tag:"concept"}]}]},

{code:"1H414010", title:"建筑给水排水", root:"给水排水", children:[
 {name:"给水系统", tag:"branch", children:[
   {name:"引入管→水表→干立支管→配水点", tag:"concept"},
   {name:"止回阀/减压阀设置", tag:"concept"}]},
 {name:"管材连接", tag:"branch", children:[
   {name:"PP-R 热熔连接", tag:"concept"},
   {name:"铜管钎焊·不锈钢卡压", tag:"concept"},
   {name:"排水铸铁柔性连接", tag:"concept"}]},
 {name:"试验", tag:"branch", children:[
   {name:"水压：1.5倍工作压力且≥0.6MPa", tag:"formula"},
   {name:"通球：球径≥2/3管径·通球率100%", tag:"formula"},
   {name:"隐蔽前灌水试验", tag:"concept"}]},
 {name:"卫生器具", tag:"branch", children:[
   {name:"存水弯水封·通气管", tag:"concept"}]}]},

{code:"1H414020", title:"建筑电气", root:"建筑电气", children:[
 {name:"接地形式", tag:"branch", children:[
   {name:"TN-S(五线) / TN-C / TN-C-S", tag:"formula"},
   {name:"TT / IT", tag:"formula"}]},
 {name:"防雷接地", tag:"branch", children:[
   {name:"接闪器：避雷针/带/网", tag:"concept"},
   {name:"金属氧化物接闪器持续电流", tag:"concept"},
   {name:"引下线·接地装置", tag:"concept"}]},
 {name:"等电位联结", tag:"branch", children:[
   {name:"MEB 总等电位", tag:"formula"},
   {name:"SEB 辅助 / LEB 局部", tag:"formula"}]},
 {name:"照明与配电", tag:"branch", children:[
   {name:"灯具安装高度·应急照明照度", tag:"concept"},
   {name:"配电箱接线正确·标识清晰", tag:"concept"}]}]},

{code:"1H414030", title:"通风与空调", root:"通风与空调", children:[
 {name:"调试顺序", tag:"branch", children:[
   {name:"单机试运转", tag:"concept"},
   {name:"无生产负荷联动", tag:"concept"},
   {name:"系统调试(风量/水量平衡)", tag:"concept"},
   {name:"综合效能测定", tag:"concept"}]},
 {name:"高效过滤器HEPA", tag:"branch", children:[
   {name:"空吹12~24h后安装", tag:"formula"},
   {name:"气流方向不得装反", tag:"concept"}]},
 {name:"管道与坡度", tag:"branch", children:[
   {name:"冷凝水坡度 ≥8‰", tag:"formula"},
   {name:"冷冻/冷却/冷凝三系统冲洗合格", tag:"concept"}]},
 {name:"风管", tag:"branch", children:[
   {name:"镀锌钢板·咬口连接", tag:"concept"},
   {name:"漏光/漏风试验", tag:"concept"}]}]},

{code:"1H414040", title:"建筑智能化", root:"建筑智能化", children:[
 {name:"系统组成", tag:"branch", children:[
   {name:"信息设施：综合布线/网络/电视", tag:"concept"},
   {name:"设备监控BA", tag:"concept"},
   {name:"安防：视频/门禁/入侵报警", tag:"concept"},
   {name:"智能化集成", tag:"concept"}]},
 {name:"综合布线", tag:"branch", children:[
   {name:"水平子系统/干线子系统", tag:"concept"},
   {name:"超五类/六类性能", tag:"concept"}]},
 {name:"调试顺序", tag:"branch", children:[
   {name:"单体→子系统→联调→联动", tag:"concept"}]},
 {name:"验收", tag:"branch", children:[
   {name:"资料齐全·检测合格·试运行正常", tag:"concept"}]}]},

{code:"1H414050", title:"电梯工程", root:"电梯工程", children:[
 {name:"分类", tag:"branch", children:[
   {name:"曳引驱动(最常见)", tag:"concept"},
   {name:"液压 / 强制驱动", tag:"concept"}]},
 {name:"曳引机安装", tag:"branch", children:[
   {name:"承重梁埋设·找正·减振", tag:"concept"}]},
 {name:"导轨", tag:"branch", children:[
   {name:"基准线定位·间距垂直度", tag:"concept"}]},
 {name:"安全部件", tag:"branch", children:[
   {name:"限速器·安全钳·缓冲器", tag:"concept"},
   {name:"门锁装置", tag:"concept"}]},
 {name:"关键数据", tag:"formula", children:[
   {name:"平衡系数 0.4~0.5", tag:"formula"},
   {name:"层门地坎间距 25~35mm", tag:"formula"}]}]},

{code:"1H414060", title:"消防工程", root:"消防工程", children:[
 {name:"自动喷水四类型", tag:"branch", children:[
   {name:"湿式：有压水·4~70℃·最常用", tag:"formula"},
   {name:"干式：有压气·≤4℃或≥70℃", tag:"formula"},
   {name:"预作用：准工作无压水·防误喷", tag:"concept"},
   {name:"雨淋：开式·蔓延快危险大", tag:"concept"}]},
 {name:"水喷雾", tag:"branch", children:[
   {name:"电气火灾(变压器)·液体火灾", tag:"concept"}]},
 {name:"气体灭火", tag:"branch", children:[
   {name:"七氟丙烷/CO2/IG541", tag:"concept"},
   {name:"机房电气场所·设泄压口", tag:"concept"}]},
 {name:"火灾报警与验收", tag:"branch", children:[
   {name:"感烟/感温/感光探测器", tag:"concept"},
   {name:"联动控制器·联动试验", tag:"concept"}]}]},

{code:"1H431010", title:"计量法及相关规定", root:"计量法规", children:[
 {name:"计量器具分类", tag:"branch", children:[
   {name:"A类：社会公用/强制检定", tag:"concept"},
   {name:"B类：计量标准与工作器具", tag:"concept"},
   {name:"C类：低值易耗非强检", tag:"concept"}]},
 {name:"强制检定范围", tag:"branch", children:[
   {name:"贸易结算·安全防护·医疗卫生·环境监测", tag:"concept"}]},
 {name:"检定管理", tag:"branch", children:[
   {name:"按检定规程周期执行", tag:"concept"},
   {name:"超周期不得使用", tag:"concept"},
   {name:"出具检定/校准证书", tag:"concept"}]}]},

{code:"1H431020", title:"电力法及相关规定", root:"电力法", children:[
 {name:"杆塔禁取土范围", tag:"formula", children:[
   {name:"35kV → 4m", tag:"formula"},
   {name:"110~220kV → 5m", tag:"formula"},
   {name:"330~500kV → 8m", tag:"formula"}]},
 {name:"架空线路保护区", tag:"formula", children:[
   {name:"1~10kV：5m", tag:"formula"},
   {name:"35~110kV：10m", tag:"formula"},
   {name:"154~330kV：15m", tag:"formula"},
   {name:"500kV：20m", tag:"formula"}]},
 {name:"保护义务", tag:"branch", children:[
   {name:"保护区内禁建危房设施", tag:"concept"},
   {name:"施工作业保持安全距离", tag:"concept"},
   {name:"临时用电须申请", tag:"concept"}]}]},

{code:"1H431030", title:"特种设备安全法", root:"特种设备安全法", children:[
 {name:"设备范围", tag:"branch", children:[
   {name:"锅炉/压力容器/压力管道", tag:"concept"},
   {name:"电梯/起重机械/客运索道", tag:"concept"},
   {name:"大型游乐设施/场车", tag:"concept"}]},
 {name:"安装管理", tag:"branch", children:[
   {name:"安装前书面告知监管部门", tag:"concept"},
   {name:"监督检验合格方可交付", tag:"concept"}]},
 {name:"使用单位义务", tag:"branch", children:[
   {name:"办理使用登记", tag:"concept"},
   {name:"定期检验", tag:"concept"},
   {name:"安全管理制度+应急预案", tag:"concept"}]}]},

{code:"1H432000", title:"工业安装工程施工质量验收", root:"质量验收", children:[
 {name:"验收层次", tag:"branch", children:[
   {name:"检验批(最小单位)", tag:"concept"},
   {name:"分项工程 → 分部工程 → 单位工程", tag:"concept"}]},
 {name:"分项工程合格", tag:"branch", children:[
   {name:"主控项目 100%合格", tag:"formula"},
   {name:"一般项目 ≥80%合格", tag:"formula"},
   {name:"资料完整", tag:"concept"}]},
 {name:"隐蔽工程", tag:"branch", children:[
   {name:"隐蔽前监理验收·合格后隐蔽", tag:"concept"}]},
 {name:"竣工验收", tag:"branch", children:[
   {name:"功能性试验合格·资料齐全", tag:"concept"}]}]},

{code:"1H420010", title:"施工组织设计与项目管理", root:"施工组织设计", children:[
 {name:"施工组织设计内容", tag:"branch", children:[
   {name:"工程概况·施工部署", tag:"concept"},
   {name:"施工方案·进度计划", tag:"concept"},
   {name:"资源配置·质量安全环境措施·平面布置", tag:"concept"}]},
 {name:"施工方案", tag:"branch", children:[
   {name:"编制依据·方法·资源配置", tag:"concept"},
   {name:"质量安全技术措施·计算书", tag:"concept"}]},
 {name:"项目管理", tag:"branch", children:[
   {name:"项目经理负责制", tag:"concept"},
   {name:"成本·进度·质量·安全·环境目标", tag:"concept"}]},
 {name:"技术交底", tag:"branch", children:[
   {name:"方案交底→分项工程技术交底", tag:"concept"},
   {name:"书面交底·双方签字", tag:"concept"}]}]},

{code:"1H420020", title:"施工合同管理", root:"施工合同", children:[
 {name:"索赔", tag:"branch", children:[
   {name:"28天内提交索赔意向通知", tag:"formula"},
   {name:"按期限提交索赔报告", tag:"concept"},
   {name:"逾期丧失索赔权", tag:"concept"}]},
 {name:"合同解除", tag:"branch", children:[
   {name:"发包人原因/承包人原因/不可抗力", tag:"concept"},
   {name:"解除后按合同结算", tag:"concept"}]},
 {name:"工程变更", tag:"branch", children:[
   {name:"指令/建议→评估→批准→实施", tag:"concept"},
   {name:"变更费用调整", tag:"concept"}]},
 {name:"价款结算", tag:"branch", children:[
   {name:"预付款·进度款·竣工结算", tag:"concept"}]}]},

{code:"1H420030", title:"施工进度管理", root:"进度管理", children:[
 {name:"网络计划", tag:"branch", children:[
   {name:"双代号(箭线图)·单代号", tag:"concept"},
   {name:"虚工作·节点编号", tag:"concept"}]},
 {name:"时间参数", tag:"formula", children:[
   {name:"总时差 TF = LS - ES", tag:"formula"},
   {name:"自由时差 FF = min(紧后ES) - EF", tag:"formula"},
   {name:"关键工作 TF=0", tag:"formula"}]},
 {name:"关键线路", tag:"branch", children:[
   {name:"总时差为0的线路", tag:"concept"},
   {name:"决定总工期·压缩关键工作", tag:"concept"}]},
 {name:"偏差分析", tag:"branch", children:[
   {name:"前锋线法·横道图比较·S曲线", tag:"concept"},
   {name:"控制措施：组织/技术/经济/管理", tag:"concept"}]}]},

{code:"1H420040", title:"施工质量管理", root:"质量管理", children:[
 {name:"三检制", tag:"branch", children:[
   {name:"自检·互检·专检", tag:"concept"},
   {name:"工序交接检查", tag:"concept"}]},
 {name:"质量事故分级", tag:"formula", children:[
   {name:"特别重大 ≥30死/≥1亿", tag:"formula"},
   {name:"重大 10~30死/5000万~1亿", tag:"formula"},
   {name:"较大 3~10死/1000万~5000万", tag:"formula"},
   {name:"一般 <3死/100万~1000万", tag:"formula"}]},
 {name:"四不放过", tag:"branch", children:[
   {name:"原因未查清/责任者未处理/整改未落实/教训未吸取", tag:"concept"}]},
 {name:"不合格品处置", tag:"branch", children:[
   {name:"返工·返修·让步接收·报废", tag:"concept"},
   {name:"返工后重新检验", tag:"concept"}]}]},

{code:"1H420050", title:"施工成本管理", root:"成本管理", children:[
 {name:"成本构成", tag:"branch", children:[
   {name:"直接费：人工/材料/机械/措施", tag:"concept"},
   {name:"间接费：管理/规费", tag:"concept"},
   {name:"利润·税金", tag:"concept"}]},
 {name:"目标成本", tag:"formula", children:[
   {name:"目标成本 = 预算成本 - 计划利润", tag:"formula"},
   {name:"责任成本落实", tag:"concept"}]},
 {name:"三同步", tag:"formula", children:[
   {name:"形象进度 = 产值 = 成本", tag:"formula"}]},
 {name:"降低措施", tag:"branch", children:[
   {name:"技术/组织/经济/合同措施", tag:"concept"}]},
 {name:"成本分析", tag:"branch", children:[
   {name:"比较法·因素分析法·差额计算法", tag:"concept"}]}]},

{code:"1H420060", title:"施工安全管理", root:"安全管理", children:[
 {name:"危大工程论证", tag:"formula", children:[
   {name:"深基坑 ≥5m", tag:"formula"},
   {name:"模板支撑 ≥8m 或跨度≥18m", tag:"formula"},
   {name:"落地脚手架 ≥50m", tag:"formula"},
   {name:"幕墙 ≥50m", tag:"formula"},
   {name:"起重单件 ≥100kN", tag:"formula"}]},
 {name:"安全技术交底", tag:"branch", children:[
   {name:"逐级交底·书面·签字", tag:"concept"}]},
 {name:"应急预案", tag:"branch", children:[
   {name:"综合/专项/现场处置方案", tag:"concept"},
   {name:"定期演练", tag:"concept"}]},
 {name:"事故分级", tag:"formula", children:[
   {name:"特别重大≥30死·重大10~30·较大3~10·一般<3", tag:"formula"}]},
 {name:"教育培训", tag:"branch", children:[
   {name:"三级教育·特种作业持证", tag:"concept"}]}]},

{code:"1H420070", title:"现场管理、试运行与竣工验收", root:"试运行·验收·保修", children:[
 {name:"试运行层次", tag:"branch", children:[
   {name:"单机试运行", tag:"concept"},
   {name:"联动试运行(建设单位/总承包组织)", tag:"concept"},
   {name:"投料试运行", tag:"concept"}]},
 {name:"联动试运行条件", tag:"branch", children:[
   {name:"单机合格·介质动力具备·方案批准·人员到位", tag:"concept"}]},
 {name:"竣工验收", tag:"branch", children:[
   {name:"自检→预验收→正式验收→资料移交", tag:"concept"}]},
 {name:"保修期限", tag:"formula", children:[
   {name:"电气/给排水/设备安装 2年", tag:"formula"},
   {name:"供热供冷 2个周期", tag:"formula"},
   {name:"防水 5年", tag:"formula"}]},
 {name:"现场管理", tag:"branch", children:[
   {name:"文明施工·绿色施工(四节一环保)", tag:"concept"}]}]}
];
