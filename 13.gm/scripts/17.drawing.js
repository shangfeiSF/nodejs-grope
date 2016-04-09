#!/usr/bin/env node
var common = require('./00.common')
var gm = require('gm')

function Drawing(images) {
  var images = common.prepare(images)

  gm(images.src[0])
    // 模糊滤镜
    .blur(4, 4)
    // 绘制路径
    .stroke('green', 4)  // 画笔的颜色和粗细
    .drawLine(0, 0, 50, 30)  // 路径的起点和终点
    // 绘制图形
    .fill('#000')  // 会被.fill('yellow')覆盖
    .fill('yellow')  // 图形内部的填充色
    .stroke('red', 2)  // 画笔的颜色和粗细
    .drawRectangle(80, 5, 110, 35)  // 矩形的左上顶点，右下顶点
    .drawRectangle(130, 5, 160, 35, 10)  // 矩形的左上顶点，右下顶点，圆角半径
    .drawArc(180, 0, 220, 40, -90, 180)  // 圆弧
    .drawEllipse(250, 30, 10, 20, 0, 270) // 椭圆
    .drawCircle(300, 20, 300, 40)  // 圆形的圆心，圆上的点
    .drawPolyline([340, 0], [350, 30], [340, 60], [330, 30])  // 多线段的若干点
    .drawPolygon([370, 0], [380, 20], [370, 40], [360, 20])  // 多边形的顶点
    .drawBezier([390, 0], [395, 30], [400, 60], [350, 100], [400, 120], [460, 155])  // 贝塞尔曲线的若干点
    // 绘制文本
    .fill('#f5f5f5')  // 文字内部的填充色
    .fontSize(70)  // 字体大小
    .stroke('blue', 2) // 画笔的颜色和粗细
    .drawText(20, 120, 'Graphics') // 起始坐标和内容
    .write(images.dst[0], function () {
      common.log.apply(this, arguments)
    })
}

new Drawing({
  src: ['original.png'],
  dst: ['17.drawing.png']
})