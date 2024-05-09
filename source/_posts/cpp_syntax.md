---
title: C++语法糖
date: 2024-03-05 10:35:23
tags: 架构
---

# C++

## const
1. const变量
```C++
// expression must be a modifiable lvalue
int const *p;//指针内容不可改
int* const p;//指针不可改变指向
```
2. const修饰函数
```C++
// 可以直接echo("hello world");调用
// 如果没有const会报错
// a reference of type string(not const-qualified) can not be initailized with a value of const char *
void echo(const string& str);
```
3. const修饰this指针
```C++
class Base
{
public:
	void setHeight() const
	{
		//expression must be a modifiable lvalue
		height = 3;
	}

private:
	int height;
	int weight;
};
```

## static
1. 作用域
```C++
// 全局变量只在当前文件内可见
static int global_val = 0;
```

## cast
1. const_cast
2. static_cast
3. dynamic_cast
4. reinterpret_cast

## new vs malloc
1. placement new

## object-oriented
1. 继承
2. 封装
3. 多态

## reflection
1. typeid
2. type_info

# 技巧性
1. 设计一个只能在堆上生成的对象
2. 设计一个只能在堆上生成的对象

# 必要性
1. virtual destructor
```c++
class Base
{
public:
	Base();
	virtual ~Base();//用基类的指针删除派生类对象,会调用派生类析构函数
};
```

# 破坏性
1. friend
2. mutable