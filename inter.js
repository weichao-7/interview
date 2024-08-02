const {
	log: l
} = console;
//1.原型
function PP() {
	const age = 83;
	this.runStep = '10000步'
}
PP.prototype.name = 'PP';

function FF() {
	const age = 43;
	this.runStep = '5000步'
}
FF.prototype = new PP()
FF.prototype.fName = 'FF'
FF.prototype.run = function() {

}

function SS() {
	const age = 23;
}
SS.prototype = new FF()
const ss = new SS()
l('原型继承.........', ss.name, ss.fName, ss.run)
//2.构造函数继承
function Car(name, width, height, color) {
	this.location = 'china';
	this.fin = '5%'
	this.name = name;
	this.width = width;
	this.height = height;
	this.color = color;
}

function Flr(name, width, height, color) {
	Car.call(this, name, width, height, color)
	this.sold = '100w';
}
const flx = new Flr('name', 'width', 'height', 'color')
l('构造函数继承.........', flx)
//3.完美继承
function Sorce(name, age) {
	this.name = name;
	this.age = age
}
Sorce.prototype.con = function() {
	l(this.name, this.age)
}

function Target(name, age) {
	Sorce.call(this, name, age)
}

function extend(Sorce, Target) {
	const F = function() {}
	F.prototype = Sorce.prototype
	Target.prototype = new F()
	Target.prototype.constrotor = Target.name
}
extend(Sorce, Target)
Target.prototype.newName = 'ccc'
const target = new Target('target', '18岁')
l('完美继承.........', target, target.con, target.newName, Sorce.prototype)
//4.vue响应式
const obj = {
	name: '张三'
}
const runElement = function() {
	let el = document.querySelector('#name');
	if (el) {
		el.innerHTML = obj.name
	} else {
		el = document.createElement('div')
		el.id = 'name'
		el.innerHTML = obj.name
		document.body.append(el)
	}
}
const oberserve = function(obj) {
	const objArr = Object.keys(obj);
	objArr.forEach(key => {
		const arr = []
		let tem = obj[key]
		Object.defineProperty(obj, key, {
			get() {
				if (window.__fn && !arr.includes(window.__fn)) {
					arr.push(window.__fn)
				}
				return tem
			},
			set(value) {
				tem = value
				arr.length && arr.forEach(item => {
					item()
				})
			}
		})
	})
}
const autoFun = function(fn) {
	window.__fn = fn;
	fn()
	window.__fn = null
}
oberserve(obj)
autoFun(runElement)


obj.name = 'lise'

setInterval(() => {
	obj.name = '蘑菇蘑菇'
}, 1000)

//5.数组去重
const arrSort = function(arr) {
	let newArr = [];
	const isArr = Array.isArray(arr)
	isArr && arr.forEach(item => {
		if (!newArr.includes(item)) {
			newArr.push(item);
		}
	})
	return newArr;
}
l('数组去重.........', arrSort(['a', 'c', 'd', 'd', 'd', 'c']))
//6.多维数组变一维数组
const arrToArr = function(arr) {
	const newArr = []
	const isArr = Array.isArray(arr)
	const runFn = function(array) {
		array.forEach(item => {
			if (Array.isArray(item)) {
				runFn(item)
			} else {
				newArr.push(item)
			}
		})
	}
	isArr && runFn(arr)
	return newArr
}
l('多维数组变一维数组.........', arrToArr([1, 2, [2, 3, [222, 233]]]))
//7.深拷贝
const deepClone = function(obj) {
	const newObj = Array.isArray(obj) ? [] : {};
	if (obj) {
		for (key in obj) {
			if (obj[key] && obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
				newObj[key] = deepClone(obj[key])
			} else {
				newObj[key] = obj[key]
			}
		}
	}
	return newObj
}
const cloneObj = {
	d: 'd',
	e: '1',
	'1': null,
	'0': undefined,
	arr: [{
		name: 'cc',
		d: 'd'
	}],
	obj: {
		a: 'a',
		b: 'c',
	}
}
l('深拷贝.........', cloneObj, deepClone(cloneObj))
//8.call
Function.prototype.myCall = function(ctx, ...arguments) {
	const obj = typeof ctx === 'object' && ctx ? Object(ctx) : window
	const key = Symbol()
	obj[key] = this
	obj[key](...arguments);
	delete obj[key]
	return obj
}
const testCall = function(name, age) {
	this.name = name;
	this.age = age
	this.key = name + age
}
const myCallObj = {}
testCall.myCall(myCallObj, '王', '13岁')
l('手写call.........', myCallObj)
//9.bind
// Function.prototype.myBind = function(ctx,...arguments){
// 	const obj = typeof ctx === 'object' &&ctx?Object(ctx):window
// 	const key = this
// 	return function(...argu){
// 		if(){

// 		}else{
// 			key.call(obj,...arguments,...argu)
// 		}
// 	}
// }
//promise
function Mypromise(fn) {
	let status = 'pending';
	let resolveList = [];
	let rejectList = [];
	let successMsg = '';
	let failMsg = '';

	Mypromise.prototype.resolve = function(value) {
		if (status === 'pending') {
			status = 'fulfilled';
			successMsg = value;
			resolveList.forEach(callback => callback(value));
			resolveList = []; // 清空回调列表
		}
	};

	Mypromise.prototype.reject = function(value) {
		if (status === 'pending') {
			status = 'rejected';
			failMsg = value;
			rejectList.forEach(callback => callback(value));
			rejectList = []; // 清空回调列表
		}
	};
	if (typeof fn === 'function') {
		fn(this.resolve.bind(this), this.reject.bind(this));
	}
	Mypromise.prototype.then = function(onFulfilled, onRejected) {
		if (status === 'fulfilled' && typeof onFulfilled === 'function') {
			onFulfilled(successMsg);
		}
		if (status === 'rejected' && typeof onRejected === 'function') {
			onRejected(failMsg);
		}
		if (status === 'pending') {
			if (typeof onFulfilled === 'function') resolveList.push(onFulfilled);
			if (typeof onRejected === 'function') rejectList.push(onRejected);
		}
		return this; // 支持链式调用
	};
}


const promise = new Mypromise((resove, reject) => {
	setTimeout(() => {
		//resove('success')
		reject('fail')
	}, 1000)
})
promise.then((res) => {
	console.log(res)
}, (error) => {
	console.log(error)
})
//防抖
const decone = function(fn, deTime) {
	let time = null;
	return function() {
		if (time) {
			clearTimeout(time)
		}
		time = setTimeout(() => {
			fn()
		}, deTime)
	}
}
const showWidth = function() {
	const width = document.body.clientWidth;
	const el = document.querySelector('#width')
	if (el) {
		el.innerHTML = `视口宽度：${width} px`
	} else {
		const div = document.createElement('div')
		div.id = 'width'
		div.innerHTML = `视口宽度：${width} px`
		document.body.append(div)
	}

}
//节流
const throt = function(fn, deTime) {
	let isRun = true;
	return function() {
		if (isRun) {
			isRun = false
			setTimeout(() => {
				fn()
				isRun = true
			}, deTime)
		}
	}
}
window.onresize = throt(showWidth, 500)
const PENGDING = 'pengding';
const SUCCESS = 'success';
const FAIL = 'fail';
class NewPromsie {
	#status = PENGDING;
	#data = undefined;
	constructor(fn) {
		const resove = (data) => {
			this.#setStatus(SUCCESS, data)
		}
		const reject = (data) => {
			this.#setStatus(FAIL, data)
		}
		fn(resove, reject)
	}
	#setStatus(status, data) {
		if (this.#status !== PENGDING) {
			return
		}
		this.#status = status
		this.#data = data
	}
	then(fn1, fn2) {
		if (this.#status === SUCCESS) {
			fn1(this.#data)
		}
		if (this.#status === FAIL) {
			fn2(this.#data)
		}
	}
}
const p = new NewPromsie((resove, reject) => {
	resove('resove')
})
p.then((res) => {
	console.log(res)
})
//13.理解异步

/* js是单线程的语言,因为js运行在渲染主线程内,而渲染主线程只有一条,渲染主线程承担着极其重要的工作,例如
html解析,css解析,js运行等,如果采用同步的方式,就很有可能造成阻塞,后续的任务就得不到执行.这样一来不仅白白浪费了渲染主线程的
时间,还会造成页面无法及时及时更新,给用户造成卡顿的现象.所以浏览器采用异步的方式来解决这个问题,具体措施就是遇到某些特殊的任务,
比如计时器,网络,点击,渲染主线程会把这些任务交给其他线程,自身立即结束任务的执行转而去执行后续代码.等到其他线程执行完毕后会把回调函数
包装成一个新的任务,只需要等待主线程的调度即可,这样一来浏览器就可以实现永不阻塞了. */

//14.事件循环
/* 事件循环又叫做消息循环,它是浏览器渲染主线程的主要工作方式.在谷歌源码中是这样描述的,当渲染主线程开始工作时,它开启了一个
永不停止的for循环,每次循环会从消息队列首位取出一个任务执行,而其它线程只需要在恰当的时机把任务加入到消息队列即可.以前把任务分为
宏任务跟微任务,这种说法目前已经不适合现在复杂的浏览器环境了.w3c最新的规定是任务没有优先级,但是队列有,对我们前端来说最重要的是三
种队列:微队列,交互队列,延迟队列.优先级依次从高到低.渲染主线程执行全局代码时可能产生了很多回调函数,他们有不同的类型,分别被放入
不同的消息队列,当全局代码执行完毕后,主线程首先会检查微队列,有就拿出来执行直到清空,然后检查交互队列,然后延迟队列  */