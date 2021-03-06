---
title: 'Javascript中的队列和链表'
date: '2021/1/7'
tags:
- JavaScript
- 数据结构与算法
mainImg: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '几年前在学校使用 c++ 进行数据结构与算法的学习.学得跟屎一样,丢人现眼.前段时间在飞机上看完了队列和链表部分的内容,还是觉得需要整理一下写成文章.'
---

长话短说,本文将队列和链表的知识合二为一.通过一些示例再次巩固这部分的知识.大概内容分为:

- 简单队列
- 双端队列
- 队列应用
  - 击鼓传花
  - 回文字检查
- 单向链表
- 双向链表
- 循环链表
- 排序链表

  



# 队列

队列,先进先出.排过队吗?按顺序添加和处理的任务,都可以用`队列`的结构进行存储和消费.

```js
class Queue {
  constructor () {
    this._items = {}
    this._count = 0
    this._lowestCount = 0
  }

  enqueue(e) {
    this._items[this._count] = e
    this._count++
  }
  dequeue() {
    if(this.isEmpty()) return undefined
    const r = this._items[this._lowestCount]
    delete this._items[this._lowestCount]
    this._lowestCount += 1
    return r
  }

  isEmpty() {
    return this._lowestCount === this._count
  }
  peek() {
    return this.isEmpty()  ? undefined : this._items[this._lowestCount]
  }

  size() {
    return this._count - this._lowestCount
  }

  clear() {
    this._items = {}
    this._count = 0
    this._lowestCount = 0
  }
  toString() {
    if(this.isEmpty()) return ''
    let r = ''
    for (const iterator of Object.values(this._items)) {
      r += r === '' ? `${iterator}` : `, ${iterator}`
    }
    return r
  }
}

let a = new Queue()
console.log(a.isEmpty())
a.enqueue(1)
a.enqueue('just for fun')
console.log(a.toString())
a.clear()
console.log(a.toString())
```

普通队列简单,但是有些场景需要对最新入队的元素进行操作.例如,针对需要存储一系列操作的需求.此时,需要灵活处理队首和队尾的数据内容.

当引发撤销操作的时候,操作队列可以从尾部弹出最后的操作记录.

我们需要双端队列.

```js
class Deque extends Queue{
  constructor () {
    super()
  }
  addFront(e) {
    if(this.isEmpty()) {
      this.enqueue(e)
    } else if(this._lowestCount > 0) {
      this._lowestCount--      
      this._items[this._lowestCount] = e
    } else {
      for (let i = this._count;i>0;i--) {
        // 往后移动一位
        this._items[i] = this._items[i - 1]
      }
      this._count++
      this._lowestCount = 0
      this._items[0] = e
    }
  }
	// 从队尾出队
  removeBack() {
    if(this.isEmpty()) return undefined
    const lastOne = this._items[this._count - 1]
    if(this.size() === 1) {
      this.clear()
    }
    delete this._items[this._count - 1]
    this._count--
    return lastOne
  }

  peekBack() {
    return this._items[this._count]
  }
}
```

其他方法继承于`Queue`,可以实现双端数据操作.

现在,让我们来模拟`击鼓传花`问题.

> *班级中玩一个游戏，所有学生围成一圈，从某位同学手里开始向旁边的同学传一束花。这个时候某个人（比方班长），在击鼓，鼓声停下的一刻，花落在谁手里，谁就进去表演节目*.

```js
let a = new Queue();
['杜小帅', '高海', '董文武', '雪儿', '洛克斯', '庄杯', 'K'].forEach(i => a.enqueue(i));
let createANum =  () => Math.random().toFixed(1) * 10
function start(queue) {
  if(queue.size() === 1) {
    console.log(`现场唯一的观众: ${queue.dequeue()}`);
  } else {
    if(createANum() > 7) {
      console.log(`${a.dequeue()}, 请开始你的表演.`);
    } else {
      queue.enqueue(queue.dequeue())
    }
  }
}
while(a.size() >= 1) {
  start(a)
}

// output
// 庄杯, 请开始你的表演.
// 董文武, 请开始你的表演.
// 高海, 请开始你的表演.
// 杜小帅, 请开始你的表演.
// 我, 请开始你的表演.
// 洛克斯, 请开始你的表演.
// 现场唯一的观众: 雪儿
```

接下来是回文检查,什么是回文字?

> 回文是指正反序都相等的字符串序列,例如 `lol`,`madam`等等.

最简单的方式就是使用双端队列来处理这个问题.

```js
function palindromeCheaker(str) {
  if(str === undefined || str === '' || str === null) return false;
  const deque = new Deque();
  [...str].forEach(i => deque.enqueue(i));
  while(deque.size() > 1) {
    if(deque.removeBack() !== deque.dequeue()) return false
  }
  return true
}

console.log(palindromeCheaker('121'), palindromeCheaker('madam'), palindromeCheaker('jay'))
// output
// true, true, false
```

JavaScript 任务也使用了队列这种数据结构.详情可以看看:

[详解JavaScript中的Event Loop（事件循环）机制 - 知乎](https://zhuanlan.zhihu.com/p/33058983)



# 链表

存储多个元素,数组可能是最常用的数据结构,如果需要从起点或者中间插入元素,数组的操作成本很高.尽管`JavaScript`数组支持了一些方法来做这些事,但是背后的情况同样如此.

> 数组的元素在内存中是连续的,链表则可以是不连续的,链表的关键是使用节点的属性保存下一个或者上一个链表的信息.

相比于传统数组,链表添加或者移除一个元素不需要移动其他元素,大大降低了内存成本.

![](https://pic2.zhimg.com/v2-8158f5bef33b4d38c0ff43d11139a003_1440w.jpg?source=172ae18b)

上图是从网上随便找的示意图.观察可以发现,如果要找到某个节点,需要从`head`一路往下查找.让我们来实现这一数据结构.

```js
class LinkedList {
  constructor() {
    this.count = 0;
    this.head = undefined;
  }

  push(e) {
    const element = new Node(e)
    this.count++
    if (this.head === undefined) {
      this.head = element
    } else {
      let current = this.head
      while (current.next) {
        current = current.next
      }
      current.next = element
    }
  }
  /**
   * 
   * @param {number} index 返回删除节点的 element
   */
  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head
      if (index == 0) {
        this.head = current.next
      } else {
        let prev = this.getElementByIndex(index - 1)
        current = prev.next
        prev.next = current.next
      }
      this.count--
      return current.element
    } else {
      return undefined
    }
  }

  removeValue(element) {
    const index = this.indexOf(element)
    return this.removeAt(index)
  }

  getElementByIndex(index) {
    if (index >= 0 && index < this.count) {
      let node = this.head
      for (let i = 0; i < index && node !== null; i++) {
        node = node.next
      }
      return node
    } else {
      return undefined
    }
  }

  insert(element, index) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(element)
      if (this.count === 0) {
        this.head = node
      } else {
        let prev = this.getElementByIndex(index - 1)
        node.next = prev.next
        prev.next = node
      }
      this.count++
    } else {
      return false
    }
  }

  /**
   * 
   * @param {any} element search a element, return a index
   */
  indexOf(element) {
    let current = this.head
    let index = 0
    while (current) {
      if (current.element !== element) {
        current = current.next
        index++
      } else {
        return index
      }
    }
    return -1
  }

  isEmpty() {
    return this.count === 0
  }

  size() {
    return this.count
  }

  getHead() {
    return this.head
  }

  toString() {
    if (this.count === 0) {
      return ''
    }
    let current = this.head
    while (current.next !== undefined) {
      console.log(current.element);
      current = current.next
    }
    console.log(current.element);
  }
}

class Node {
  constructor(element) {
    this.element = element;
    this.next = undefined;
  }
}
```

来思考一个算法题目,翻转链表:

> 题意：反转一个单链表。
>
> 示例: 输入: 1->2->3->4->5->NULL
> 输出: 5->4->3->2->1->NULL

直接翻转指针,可以避免多余的链表创建和内存占用.

```js
// data is a LinkedList
function reverseLinkList(data) {
  if (data.size() > 1) {
    let current = data.head
    let prev = undefined
    let next = undefined
    while (current !== undefined) {
      next = current.next;
      current.next = prev;
      prev = current
      current = next
    }
    data.head = prev
    return data
  } else {
    return data
  }
}
```



接着,看看`双向链表`:

```js
class DoublyNode extends Node {
  constructor(element, prev = undefined, next = undefined) {
    super(element, next)
    this.prev = prev;
  }
}

class DoublyLinkedList extends LinkedList {
  constructor() {
    super()
    this.tail = undefined;
  }
  push(element) {
    const node = new DoublyNode(element)
    if (this.count === 0) {
      this.head = node
      this.tail = node
    } else {
      let current = this.head
      while (current.next) {
        current = current.next
      }
      current.next = node
      node.prev = current
    }
    this.tail = node
    this.count++
  }
  insert(element, index) {
    const node = new DoublyNode(element)
    if (index >= 0 && index <= this.count) {
      if (this.count === 0) {
        this.head = node
        this.tail = node
      } else {
        let oldNode = this.getElementByIndex(index)
        console.log(oldNode.element, 'is old node');
        // 新插入节点设置了前后节点
        node.next = oldNode
        node.prev = oldNode.prev
        // 旧的节点设置了 prev
        oldNode.prev = node
        if (node.prev) {
          // 如果前节点存在
          node.prev.next = node
        } else {
          // 不存在则说明插入的是链表头
          this.head = node
        }
      }
      this.count++
      return true
    }
    return false
  }
  getTail() {
    return this.tail
  }
  /**
   * 
   * @param {number} index 1. 链表长为 1
   * 2. 长不为 1 => 1.删除首个元素/ 2.删除最后元素 / 3.删除中间元素
   */
  removeAt(index) {
    const node = this.getElementByIndex(index)
    // 空链表和无效 index
    if (this.count === 0 && node === undefined) return undefined

    // 链长 1,删除 1
    if (this.count === 1 && node === this.head) {
      this.head = undefined
      this.tail = undefined
      this.count = 0
      return node
    }
    // 链长不为 1
    // index 对应的 node 有效
    if (node === this.head) {
      this.head = node.next
    } else if (node === this.tail) {
      node.prev.next = undefined
      this.tail = node.prev
    } else {
      node.prev.next = node.next
      node.next.prev = node.prev
    }
    this.count--
    return node
  }
}
```



双向链表增加了`tail`属性,保存了链表尾部元素,且对每个节点的结构,增加了`prev`属性保存前一个节点信息.

下面看看`双向循环链表`,其跟双向链表的区别在于,对首个元素的`prev`设置为最后一个元素.最后一个元素的`next`设置为首个元素.因此,需要稍微调整代码结构.

```js
class LoopDoublyLinkedList extends DoublyLinkedList {
  constructor() {
    super()
  }
  push(element) {
    const node = new DoublyNode(element)
    if (this.count === 0) {
      this.head = node
      this.tail = node
      node.prev = node
      node.next = node
    } else {
      // 新节点的头和尾部改一下
      node.next = this.head
      node.prev = this.tail
      this.tail.next = node
      this.head.prev = node
      this.tail = node
    }
    this.count++
  }

  removeAt(index) {
    const node = this.getElementByIndex(index)
    if (node) {
      if (this.count === 1) {
        this.clear()
      } else {
        let prev = node.prev
        let next = node.next
        prev.next = next
        next.prev = prev
        this.count--
      }
      return node
    } else {
      return undefined
    }
  }
  insert(element, index) {
    const node = new DoublyNode(element)
    let targetNode = this.getElementByIndex(index)
    if (targetNode === undefined) return false

    // 确定了插入位置
    if (index === 0) {
      // 插入表头
      node.next = this.head.next
      node.prev = this.tail
      this.head.prev = node
      this.head = node
      this.tail.next = node
    } else {
      node.prev = targetNode.prev
      node.next = targetNode
      targetNode.prev.next = node
      targetNode.prev = node
    }
    this.count++
  }
  clear() {
    this.head = undefined
    this.tail = undefined
    this.count = 0
  }

  toString() {
    if (this.count === 0) return ''
    let current = this.head
    // console.log(current.element);
    // console.log(current.next, this.head);
    while (current !== this.tail) {
      console.log(current.element);
      current = current.next
    }
    console.log(current.element);
  }
}
```

双向循环链表的关键在于处理新节点的`prev`和`next`值,只要不是`空`链表,则每一个节点都有这两个值.

接下来是`有序链表`.为了让节点之间保持顺序,我们可以修改`insert`方法,让插入的位置由内部计算得出.

```js
class SortedLinkedList extends LinkedList {
  constructor() {
    super()
  }
  insert(element, index=0) {
    if(this.isEmpty()) {
      return super.insert(element, 0)
    }
    // 自定义方法定义插入位置,用默认 index 代替 index 的效果.
    const pos = this.getIndexNextSortedElement(element);
    return super.insert(element, pos)
  }
  
  getIndexNextSortedElement(element) {
    let current = this.head;
    let i = 0;
    // 遍历,直接判断大小,也可以重新定义一个比较函数
    for(;i < this.size() && current; i++) {
      if(current.element < element) {
        return i
      }
      current = current.next
    }
    return i
  }
}
```

其他方法都是继承的,不需要改变.由于插入的位置程序内部通过特定的比较算法去判断,因此实现了链表的有序性.

在操作和查找一个有序的链表的场景之下,可以使用不同的查找算法提高查找效率.



> 我想把这些数据结构都保存到自己的工具库中去,因此需要暂时停止下一步:集合和散列表的学习.转向 webpack5 和 babel7 ,用于创建良好的环境,支持自己保存工具库和自己的数据结构.
>
> 2021年01月13日00:27:40,晚安.



# 参考

- [数据结构与算法-链表(上) - 知乎](https://zhuanlan.zhihu.com/p/52878334)
- [数据结构与算法-链表(下) - 知乎](https://zhuanlan.zhihu.com/p/52841915)

