---
title: 数据库事务的隔离级别
date: 2024-02-19 17:10:58
tags: 架构
---

# ACID
## 原子性(atomicity)
## 一致性(consistency)
## 隔离性(isolation)
## 持久性(durability)

# 隔离级别(isolation)

	数据库事务的隔离级别和锁的实现密切相关，理解事务隔离级别，就明白为什么innodb要支持不同的锁，
	以及不同隔离级别下，使用不同的锁。业务的设计往往为了并发又要控制锁的粒度

	所以学习方向是，先看事务隔离级别，再看锁是满足哪种事务隔离级别，最后看binlog,redolog如何实现这些锁

## 读未提交(READ UNCOMMITTED)

	事务可以读取未提交的数据，可能会导致脏读、不可重复读和幻读问题

## 读已提交(READ COMMITTED)

	事务只能读取已经提交的数据，避免了脏读，但仍可能出现不可重复读和幻读问题

## 可重复读(REPEATABLE READ)

	保证了事务在执行过程中读取的数据是一致的，即使其他事务对数据进行了修改也不会影响当前事务的查询结果。但仍可能出现幻读问题

## 序列化(SERIALIZABLE)

	通过强制事务串行执行来避免脏读、不可重复读和幻读。但是这可能会降低并发性能

# FAQ

1. 脏读

	指一个事务读取了另一个事务尚未提交的数据。假设有两个事务 A 和 B，事务 A 读取了事务 B 修改但尚未提交的数据，然后事务 B 回滚了修改。这时事务 A 读取到的数据就是脏数据，因为它是基于一个未提交的修改

2. 不可重复读

	指一个事务在两次查询之间，另一个事务更新了新的数据，导致第一个事务在第二次查询中发现了新插入的数据

3. 幻读

	指一个事务在两次查询之间，另一个事务插入或者删除了新的数据，导致第一个事务在第二次查询中发现了新插入的数据

4. 查看mysql事务隔离级别
```sql
SELECT @@transaction_ISOLATION;
SELECT @@global.transaction_ISOLATION;

or

SELECT @@tx_ISOLATION;
SELECT @@global.tx_ISOLATION;
```
5. 修改mysql事务隔离级别
```sql
-- 设置隔离级别为 READ UNCOMMITTED
SET SESSION tx_isolation = 'READ-UNCOMMITTED';

-- 设置隔离级别为 READ COMMITTED
SET SESSION tx_isolation = 'READ-COMMITTED';

-- 设置隔离级别为 REPEATABLE READ
SET SESSION tx_isolation = 'REPEATABLE-READ';

-- 设置隔离级别为 SERIALIZABLE
SET SESSION tx_isolation = 'SERIALIZABLE';
```
