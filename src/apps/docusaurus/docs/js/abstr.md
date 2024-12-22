# 抽离与复用

虽然js不像传统的面向对象语言那样特性，但是我们依然可以做出封装与集成 来达到复用和管理的目的！

## 要求
```
|--phone.js
  | --impl
     |-- nokia.js
     |-- iphone.js
```

要求 以后不管制造哪个手机，用户都可以使用此类原获取方法

```js
const phone = Phone.getInstance("nokia");
phone.sayHi(); // 输出 nokia say hi
```

## 实现方式一

这种方式，实际上是巧妙地利用弱语言特性，让基类实现动态继承实现类，最后外部调用 是通过的基类拥有一切！

在强静态语言中，做到这一点较难，因为所谓静态 指的就是在编译之前就要确定好关系和类型，一般只能通过通过使用的反射机制来实现，而作为动态语言我们就可以轻松地多！




### 定义基类

此类提供 Phone 公共方法,当然也它也拥有继承子类的方法。  
可以在这里做对实现类的二次把控，比如重写其方法  （没有ts的加持的情况下，这么做没问题）

phone.js

```js
// 动态导入所有具体实现的个性类，如果嫌这样浪费性能，可以在基类的getInstance里动态导入单个类
const requireModules = import.meta.glob("./impl/**/*.ts", { eager: true });
let modules: any = {};
for (const path in requireModules) {
  const moduleConent: any = requireModules[path];
  modules[moduleConent.default.name] = moduleConent.default;
}

/**
 * 基类Phone，本质上工具类函数
 */
export default class Phone {
  static version = "1.0";
  static getInstance(type: string) {
    // 这才是基基类 （实现了动态继承）
    class InnerClass extends modules[type] {
      constructor() {
        super();
      }
      sayHi() {
        super.sayHi();
      }
    }
    return new InnerClass();
  }
}
```

### 实现类具体实现
实现类是具体的实现方法，但是要求必须实现基类用到的属性或方法（如果是 ts 可以通过 interface 约束，否则只能绩效约束）！

基础例子

```js
// impl/nokia.js
export default class Nokia {
  static name = "nokia";
  sayHi() {
    console.log("nokia say hi");
  }
}
```

还可以继续继承

```js
// impl/nokia.js
import live from "Device";

export default class Nokia extends Device {
  static name = "nokia";
  constructor() {
    super();
  }
  sayHi() {
    console.log("nokia say hi");
    // 这里还可以调用更上级父类的方法
    super.hi();
  }
}
```


还可以Ts约束

```ts
// PhoneInterface.ts
export default interface PhoneInterface {
    sayHi(): void;
  }
```

```ts
// impl/nokia.ts
import live from "Device";

export default class Nokia extends Device implements PhoneInterface {
  static name = "nokia";
  constructor() {
    super();
  }
  sayHi() {
    console.log("nokia say hi");
    // 这里还可以调用更上级父类的方法
    super.hi();
  }
}
```

### 优点
```js
const phone = Phone.getInstance("nokia");
```

* 这个 phone 对象拥有每一层父级的所有方法和属性，包括公共Phone类的统一基类方法！ 
* phone 类，可以作为约束和统筹具体实现类（也就是父类）的作用。
* 具体实现类还可以继续继承或者使用ts的接口去强制约束。



---

## 实现方式二

这种方式，就是传统的 oop 模式，封装、继承和多态， 通过动态传入不同实现类 --> 到工厂函数，工厂函数再利用多态创建了具体实现类的实例（不过需要注意的是 多态在js中毫无意义，因为js本身就是动态和弱语言，较为灵活不受类型限制）！

最终你外部使用的是具体的实现类对象，而非非统一的基类对象，优点是简单易懂，缺点是 无法通过基类对实现类做限制，因为你用的就是具体实现类的对象嘛！

多态
```ts
interface PhoneInterface {
  sayHi(...arg:any[]):void;
}

class Phone implements PhoneInterface {
  static version = '1.0';
  sayHi(){
    console.log('phone say hi');
  }
}

class Nokia extends Phone implements PhoneInterface {
  sayHi(){
    console.log('nokia say hi');
    
  }
}
const createPhoneFactory = (_class: typeof Phone) => new _class() //这里体现的就是多态
const nokia = createPhoneFactory(Nokia);
nokia.sayHi()
```


## 总结
两者都实现了面向对象封装继承的思想，   
前者利用动态继承，让基类动态继承了实现类，你真正用到的是基类实例。   
后者就是让实现类继承了基类，这很符合大众思维，你真正用到的是实现类的实例。   