import { afterEach, beforeEach, describe, it } from 'std/testing/bdd.ts'
import { User } from 'std/testing/bdd_examples/user.ts'
import {
  assertEquals,
  assertExists,
  assertObjectMatch,
  assertStrictEquals,
  assertThrows,
} from 'std/testing/asserts.ts'

import type { ForexExchangeAccount } from 'lib/config.d.ts'

import ForConn from 'src/bot/forex/forex.ts'

// import * as logging from 'std/log/mod.ts'
// await logging.setup({ loggers: { default: { level: "WARNING" } } })

describe("Connection", () => {

  const account = {
    broker: 'string',
    username: 'string',
    password: 'string',
    appKey: 'string',
    name: 'string',
    type: 'test',
  } as ForexExchangeAccount

  it("account registered", () => {
    const conn = new ForConn(account)
    assertExists( conn )
    assertExists( conn.user )
    assertObjectMatch( account, conn.account )
    assertStrictEquals( account, conn.account )
    assertEquals( conn.account.broker, 'string' )
    assertEquals( conn.account.username, 'string' )
    assertEquals( conn.account.password, 'string' )
    assertEquals( conn.account.appKey, 'string' )
    assertEquals( conn.account.name, 'string' )
    assertEquals( conn.account.type, 'test' )
  });

  describe("age", () => {
    let user: User;

    beforeEach(() => {
      user = new User("Kyle");
    });

    afterEach(() => {
      User.users.clear();
    });

    it("getAge", function () {
      assertThrows(() => user.getAge(), Error, "Age unknown");
      user.age = 18;
      assertEquals(user.getAge(), 18);
    });

    it("setAge", function () {
      user.setAge(18);
      assertEquals(user.getAge(), 18);
    });
  });
});
