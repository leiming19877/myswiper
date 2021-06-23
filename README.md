# myswiper  自动轮播js组件
====
  为什么要写一个swiper,用现成的swiper js不行吗？在回答这个问题之前，我想说swiper
js 组件确实功能强大，但我在面对自己的需要求时，需要做一个动态添加swiper 内容项的功能，且
能随时清除所有slider项目，然后再动态添加。我思索了一会，我这个swiper功能应该不要非常强大，
但只要满足以下几个要求：
1. 能动态添加slider 
2. 能全部清空内容，当清空之后能回到初始第一页。
3. 支持自动轮播
4. 分页支持

想着功能比较简单，假如我不用swiper js组件，自己是不是也能写一个myswiper组件出来呢？
有了想法，就要去行动。开干...

#先上几个实质应用图列
![myswiper 图片](./demo/myswiper-20210623143734.png)
<video src="./demo/myswiper-2021-06-23%2014.18.45.mov" controls="controls" width="500" height="300">您的浏览器不支持播放该视频！</video>

整体来说myswiper代码不是非常复杂，大概几百行代码，大家可以见自己去发挥