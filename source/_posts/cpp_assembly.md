---
title: C++反汇编
date: 2024-02-29 16:59:11
tags: 架构
---

# C++

	学习C++就要了解编译器，就要学会反汇编，要知道编译器自动做了哪些工作。

## g++
* 使用预处理：

	包括 条件编译(#ifdef)，行控制(#pragma)，文件包含（#include），宏定义(#define)。不包括模版实例化，目前主流编译器也没有模版实例化中间代码，实例化是在预处理之后的
```shell
gcc -E hello.c -o hello.i
```

* 使用汇编：
```shell
gcc -S hello.c -o hello.s
```

* 使用调试：
```shell
gcc -g hello.c -o hello
```

* 使用优化
```shell
gcc -O2 hello.c -o hello
```

* 使用交叉编译
```shell
gcc -m32 hello.c -o hello
```

# assembly
## g++
* 使用汇编：
```shell
gcc -S hello.c -o hello.s
```
	生产hello.s文件，可以查看该文件的汇编代码

## gdb

	也可以si单步进入到汇编
```shell
(gdb) disassemble /m
# or
(gdb) si
```
```shell
4               i=i++;
(gdb) disassemble /m
Dump of assembler code for function main():
2       {
   0x0000555555555125 <+0>:     push   %rbp
   0x0000555555555126 <+1>:     mov    %rsp,%rbp

3               int i=0;
   0x0000555555555129 <+4>:     movl   $0x0,-0x4(%rbp)

4               i=i++;
=> 0x0000555555555130 <+11>:    mov    -0x4(%rbp),%eax
   0x0000555555555133 <+14>:    lea    0x1(%rax),%edx
   0x0000555555555136 <+17>:    mov    %edx,-0x4(%rbp)
   0x0000555555555139 <+20>:    mov    %eax,-0x4(%rbp)

5               return 0;
   0x000055555555513c <+23>:    mov    $0x0,%eax

6       }
   0x0000555555555141 <+28>:    pop    %rbp
   0x0000555555555142 <+29>:    ret

End of assembler dump.
```
