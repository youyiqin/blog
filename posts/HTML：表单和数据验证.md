---
title: 'HTML：表单和数据验证'
date: '2021/5/30'
tags:
- HTML
mainImg: 'https://images.unsplash.com/photo-1553196798-b71feabce946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjIzNzgwMjc&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1553196798-b71feabce946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjIzNzgwMjc&ixlib=rb-1.2.1&q=80&w=400'
intro: '为了丰富我的 HTML 体系知识，专门针对表单和数据验证进行了回顾，本文将对表单和数据验证的知识进行总结。'
---

在提交用户在表单中填写的数据到服务器的过程中，无论是客户端或者服务端都需要对数据进行验证。客户端验证既可以约束用户输入的内容，获取格式正确的信息，也可以提升用户体验，减轻服务器的压力。客户端验证很容易被绕过，因此服务端数据验证则是最后一道保障，必须要具有完备的验证逻辑。

今天，我们来聊聊`客户端表单验证`。

## 前言

我们既希望表单尽可能地易用，也希望表单能够对数据做严格的验证，究其原因不外乎以下几点：

- 开发者希望获取正确的数据，且数据具有正确的格式
- 开发者希望能够保护用户的数据，例如希望用户的密码具有一定的复杂度，避免使用过于简单的密码
- 开发者希望保护应用或网站本身，服务器安全也是开发者需要关注的一部分

## 数据验证技术

通常，开发者可以从以下两种方案去做数据验证：

- 浏览器内置的数据验证功能接口
- 使用 JavaScript 严格控制数据结构

#### 使用内置验证接口

`HTML5`为`form`标签提供了具有数据验证功能的属性：

- `required`: 在提交前必须填写
- `minlength`和`maxlength`：指定填写的字符串长度最小值和最大值
- `min`和`max`： 指定值的范围
- `type`：`input`标签常用此属性为输入值提供样式和数据类型默认匹配规则，例如值为`email`，则会验证填写的值是否是一个合格的`email`地址
- `pattern`：指定一个正则表达式作为匹配规则，通常我们可以针对特定的数据格式提供一个严格的`pattern`正则表达式作为匹配条件

当数据通过了浏览器内置的验证规则时，相关的元素可以使用`:valid` CSS 伪类来指定一些样式代码，并且在没有用户主动终止提交表单行为或者没有`Javascript`代码拦截表单提交行为的时候，数据可以顺利提交到服务器。

> `input:required:valid`伪类可以设置多个条件同时满足的时候的样式

如果数据无法通过浏览器内置的验证规则，则相关元素可以使用`:invalid` CSS 伪类来指定一些样式代码来强调或突出数据验证失败的讯息，浏览器也会默认提供一些数据验证失败的原因提示。

举个例子：

```css
input:required:invalid, input:focus:invalid {
  background-image: url(/images/invalid.png);
  background-position: right top;
  background-repeat: no-repeat;
}
input:required:valid {
  background-image: url(/images/valid.png);
  background-position: right top;
  background-repeat: no-repeat;
}
```

为输入框设置一个靠右的状态提示背景图。

#### 使用 JavaScript 验证表单

`HTML5`表单特性很棒，但是遗憾的是并非所有浏览器都支持`HTML5`，有时候我们需要使用`JavaScript`来增强应用的兼容性。

如果你想获得更灵活的控制权，或者统一不同浏览器的兼容性，提供错误信息提示的一致性方案，或是对错误信息的展示进行美化，从而让用户获得更好的使用体验，使用`JavaScript`进行表单验证是最佳的选择。



好在大多数浏览器都支持[Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation),此特性提供了一系列关于浏览器表单数据验证的`DOM`元素接口：

- HTMLButtonElement
- HTMLFieldSetElement
- HTMLInputElement
- HTMLOutputElement
- HTMLSelectElement
- HTMLTextAreaElement

根据命名就很容易得知其代表的元素标签是什么，`Constraint Validation API`使得上述元素具有以下属性和方法：

- validationMessage：返回一个本地化的数据验证描述字符串，验证失败时，各个浏览器厂商的实现方式不一致导致此属性的值可能不一致。验证成功则一致返回空字符串。
- valididy：返回一个`ValidityState`对象，此对象支持一系列的数据验证方法的布尔值，我们可以根据此对象的方法判断表单数据的正确性，并编写相关代码，即使在`IE 10~11`上，表单验证的支持度都很高，足以让我们通过原生的接口控制表单验证和样式。
- willValidate：如果表单提交时会进行数据验证则返回`true`，否则返回`false`。
- checkValidity()：此方法返回元素的验证性布尔值。
- setCustomValidity(message)：此方法可以通过`JavaScript`统一兼容不同厂商的数据验证提示信息，但由于依然需要细粒度地兼容提示信息的样式，也许选择使用此方法的开发者并不多。

现如今几乎很少有开发者自己手动编写数据验证验证代码，社区开源的诸多数据验证的第三方库（诸如`Validate.js`）在大多数时候都能满足我们的需求（即使存在些许需求需要微调，也可以在其基础上添加一些方法弥补），但是笔者认为`了解原生数据验证的原理和使用方法对于开发者来说依然是很有学习价值的`。

话说回来，让我编写了一个简单的数据验证的`Demo`:

`HTML`部分为：

```jsx
<form onSubmit={sub} noValidate>
  <input type="text" minLength="2" placeholder="username" id="username" required/>
  <input type="password" placeholder="password" id="password" required/>
  <input type="email" placeholder="email" id="email" required/>
  <button>submit</button>
</form>
{
  state !== true && <section>{state + " 🤔"}</section>
}
```

`JavaScript`部分为：

```jsx
useEffect(() => {
  const userInput = document.querySelector("#username")
  userInput.addEventListener('input', (evt) => {
    if(userInput.validity.tooShort) {
      // user.setCustomValidity("")
      setState("username is too short.")
    } else {
      // user.setCustomValidity("")
      setState(true)
    }
  })
},[])
```

为了简单起见，只检查用户名输入字符串是否大于等于2，我在`form`标签上添加了`noValidate`属性（此属性支持度非常高），屏蔽了不同厂商的数据验证提示样式，我们自己来写样式。

最终数据未通过验证和通过验证的截图如下：

![image-20210602001552596](https://i.loli.net/2021/06/02/a2pQjSzb3ZPVfC1.png)



![image-20210602001538284](https://i.loli.net/2021/06/02/cimGA4wqBgKdsfT.png)



结合数据验证的结果，我们可以通过控制不同标签的`:invalid`和`:valid`伪类去控制样式，从而让不同浏览器之间具有一致的表现效果。



## 最后

如果你需要控制客户端表单数据验证的样式和提示信息，则需要`JavaScript`配合原生的[Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation)接口来处理验证逻辑方面的细节，但这并不是最难的，困难的部分在于应对用于各种不可知的神奇输入内容。

总之，再次引用`developer.mozilla.org`参考上关于表单数据验证的三点建议：

- 明确地展示错误信息
- 接受用户的输入格式
- 指出错误发生的确切的位置，尤其是在大型界面上

最后，`严格验证用户输入`，一旦用户输入通过了客户端验证，后面的问题就交给服务端吧。

今天的内容就到这了，我们下次再会。

## 参考

- [Client-side form validation - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [HTML5 Form Validation Examples < HTML | The Art of Web](https://www.the-art-of-web.com/html/html5-form-validation/#user_comments)
- [Data Validation – How to Check User Input on HTML Forms with Example JavaScript Code](https://www.freecodecamp.org/news/form-validation-with-html5-and-javascript/)
- [Native form validation with JavaScript | falldowngoboone](https://www.falldowngoboone.com/blog/native-form-validation-with-javascript/)

