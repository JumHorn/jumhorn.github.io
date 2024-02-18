---
title: 数据库事务的锁
date: 2024-02-18 22:24:41
tags: 架构
---

# 锁

1. 事务的执行是基于socket连接的，当连接连接中断或者超时，事务会回滚
2. 多个事务执行时，可以开启两个终端测试不同的锁

# 锁的分类

## 共享锁 (Shared Locks)

	共享锁允许多个事务同时读取一个资源，但是不允许写入操作，直到所有的共享锁被释放

```sql
START TRANSACTION;

-- 以共享模式锁定表中的行
SELECT * FROM your_table WHERE some_column = 'value' LOCK IN SHARE MODE;

-- 在事务中可以进行其他的并发读取操作

COMMIT;
```

## 排他锁 (Exclusive Locks)

	排他锁限制对资源的访问，只允许一个事务独占资源。其他事务不能对同一资源进行读取或写入操作

```sql
START TRANSACTION;

-- 以排他模式锁定表中的行
SELECT * FROM your_table WHERE some_column = 'value' FOR UPDATE;

-- 在事务中可以进行更新或删除等操作

COMMIT;
```

## 行级锁 (Row-level Locks)

	innodb默认使用行级锁，行级锁只会锁定所需的行，而不是整个表。这样其他事务就可以并发地访问表中的其他行
```sql
START TRANSACTION;

-- 在行级别锁定特定的行
SELECT * FROM your_table WHERE id = 123 FOR UPDATE;

-- 在事务中进行其他操作，只锁定了 id 为 123 的行

COMMIT;
```

## 表级锁 (Table-level Locks)

	表级锁会锁定整个表，而不是单个行。这样会阻塞其他事务的读取或写入操作，导致性能问题
```sql
LOCK TABLES your_table WRITE;

-- 在表级别执行写操作

UNLOCK TABLES;

```

## 意向锁
```sql
```

# 实际测试

1. 终端1
```shell
mysql> start transaction;
Query OK, 0 rows affected (0.02 sec)

mysql> select * from users where id=3 for update;
+----+----------+----------+
| id | username | password |
+----+----------+----------+
|  3 | yasuo    | 65c05a0c |
+----+----------+----------+
1 row in set (0.01 sec)

mysql> rollback;
Query OK, 0 rows affected (0.01 sec)
```

2. 终端2
```shell
mysql> update users set mail="yasuo@gmail.com" where id=3;
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
```

	其中终端2的命令在终端1开启锁之后rollback之前执行，就可以看到命令执行失败。
	所有锁都可以如此测试查看锁的特性

# FAQ

1. mysql事务都设置了timeout

	死锁的必要条件(互斥条件/请求与保持条件/不剥夺条件/循环等待条件)
	timeout破环了请求与保持条件，故不会发生死锁