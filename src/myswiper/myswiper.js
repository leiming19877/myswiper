/*
 * Copyright (c) 2021.
 * leiming.
 * 自定义简单的Swiper组件
 */
function Swiper(id,options = {
        pageSize:3,
        enablePlay:true,
        pagePlayTime:5
    }) {

    //private filed
    this.pageSize = 3;
    if(options.pageSize){
        this.pageSize = options.pageSize;
    }
    //当前播放第几页,默认第一页开始
    this.page = 1;
    //定时轮播
    this.timer = 0;
    //是否开启自动播放
    this.enablePlay = true;
    if(typeof options.enablePlay !== 'undefined' ){
        this.enablePlay = options.enablePlay;
    }
    //多久自动轮播一次
    this.pagePlayTime = 5*1000;
    if(options.pagePlayTime){
        this.pagePlayTime = options.pagePlayTime*1000;
    }
    this.sp = document.getElementById(id);
    if(!this.sp){
        throw new Error("swiper id is not exist");
    }
    this.initDom();
    //数据页元素
    this.ul = this.sp.getElementsByClassName("ul")[0];
    //指标总元素
    this.bp = this.sp.getElementsByClassName("b-p")[0];
    //初始化进入出去事件
    this.moveIn = "mouseover";
    this.moveOut = "mouseout";
    if('ontouchstart' in window){
        this.moveIn = "touchstart";
        this.moveOut = "touchend";
    }
    this.initEvent();
    if(this.enablePlay){
        this.initTimer();
    }
};

/**
 * 选择性初始化dom
 */
Swiper.prototype.initDom = function(){
    if(this.sp.getElementsByClassName("ul").length == 0){
        let ul =  document.createElement('ul');
        ul.classList.add("ul");
        this.sp.appendChild(ul);
    }
    if(this.sp.getElementsByClassName("ol").length == 0){
        let ol = document.createElement('b-p');
        ol.classList.add("b-p");
        this.sp.appendChild(ol);
    }

}
/**
 * 初始化事件
 */
Swiper.prototype.initEvent = function(){
    /*视件代理类型写法
    while(currentNode  !== event.currentTarget){
        if(currentNode.matches(".b-p .point")){
            //var index = currentNode.textContent;
            [].slice.call(currentNode.parentNode.children).forEach(item=>{
                item.classList.remove("at");
            });
            var index = [].indexOf.call(currentNode.parentNode.children,currentNode);
            var p = -100 * index;
            ul.style.transform  = "translateX("+p+"%)";
            currentNode.classList.add("at");
            break;
        }
        currentNode = currentNode.parentNode;
    }*/
    this.initPointEvent();
    //初始化进入及出去事件
    this.initMoveEvent();

};
/**
 * 初始化园圈指标事件
 */
Swiper.prototype.initPointEvent = function(){
    this.sp.addEventListener('click',(event)=>{
        var currentNode  = event.target;
        var rc = event.currentTarget;
        var ul = rc.getElementsByClassName("ul")[0];
        //事件代理写法
        if(!currentNode.matches(".b-p .point")){
            return ;
        }
        if(this.enablePlay){
            this.clearTimer();
        }
        var index = [].indexOf.call(currentNode.parentNode.children,currentNode);
        this.page = index+1;
        this.goPage();
        if(this.enablePlay){
            this.initTimer();
        }

    },false);
};
/**
 * 当启用自动轮播时，元素进入及出去都暂停轮播
 */
Swiper.prototype.initMoveEvent = function(){
        if(!this.enablePlay){
            return ;
        }
        this.ul.addEventListener(this.moveIn,this.onMoveIn.bind(this),false);
        this.ul.addEventListener(this.moveOut,this.onMoveOut.bind(this),false);
}

/**
 * 进入事件
 * @param event
 */
Swiper.prototype.onMoveIn = function(event){
    this.clearTimer();
}

/**
 * 移出事件
 * @param event
 */
Swiper.prototype.onMoveOut = function(event){
    event.preventDefault();
    this.initTimer();
}

/**
 * 启动自动轮播
 */
Swiper.prototype.initTimer = function(){
    this.timer = window.setInterval(()=>{
        this.next();
    },this.pagePlayTime)
};
/**
 * 清除自动跳转
 */
Swiper.prototype.clearTimer = function(){
    window.clearInterval(this.timer);
};
/**
 * 跳转到指定页
 * @param page
 */
Swiper.prototype.goPage = function(page){
    if(page){
        this.page = page;
    }
    let currentNode = this.bp.children[this.page-1];
    [].slice.call(this.bp.children).forEach(item=>{
        item.classList.remove("at");
    });
    var index = [].indexOf.call(currentNode.parentNode.children,currentNode);
    var p = -100 * index;
    this.ul.style.transform  = "translateX("+p+"%)";
    currentNode.classList.add("at");
};

/**
 * 跳转到下一页
 */
Swiper.prototype.next = function(){
    var len = this.bp.children.length;
    if(this.page >= len){
        this.page = 1;
    }else{
        this.page++;
    }
    this.goPage();
};

/**
 * 动态添加一个元素
 * @param id
 * @param html  元素html内容
 * @param callback  添加后回调
 */
Swiper.prototype.add = function(id,html,callback){
    //判断是否要添加指示
    let len = this.ul.children.length;
    let addPoint = false;
    //判断是否要添加指示园圈，如果现在刚好不用添加，那添加一个元素之后肯定是要添加的
    if(len % this.pageSize === 0){
        addPoint = true;
    }
    //内容
    let li = document.createElement('li');
    let box = document.createElement('div');
    box.classList.add("c-box");
    if(id){
        box.setAttribute("id",id);
    }
    if(html){
        box.innerHTML = html;
    }
    li.appendChild(box);

    this.ul.appendChild(li);
    //需要添加指标园圈
    if(addPoint){
        //内容
        let pointLi =document.createElement('li');
        pointLi.textContent = this.bp.children.length + 1;
        pointLi.classList.add("point")
        //如果是第一个添加
        if(this.bp.children.length == 0){
            pointLi.classList.add("at")
        }
        this.bp.appendChild(pointLi);

    }
    if(typeof callback === 'function'){
        callback.call(this);
    }
};

Swiper.prototype.destroy = function(){
    this.sp = null;
    this.ul = null;
    this.bp = null;
    this.clearTimer();
    if(this.enablePlay){
        this.ul.removeEventListener(this.moveIn,this.onMoveIn);
        this.ul.addEventListener(this.moveOut,this.onMoveOut);
    }
};

export default  Swiper;