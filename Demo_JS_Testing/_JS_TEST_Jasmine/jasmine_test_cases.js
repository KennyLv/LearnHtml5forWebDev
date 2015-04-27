describe("A suite of basic functions test : 基本方法的单元测试", function() {
	var name;
	it("UT for : sayHello", function() {
			name = "Conan";
			var exp = "Hello Conan";
			expect(exp).toEqual(sayHello(name));
	});
	
	it("UT for : reverse",function(){
			expect("DCBA").toEqual(reverse("ABCD"));
			expect("Conan").toEqual(reverse("nanoC"));
	});

});

xdescribe("Disabling Specs and Suites : 忽略suite的声明", function() {
		it("Disabling Specs and Suites",function(){
				expect("AAA").toEqual("AAA");
		});
});

describe("Pending specs : 挂起suite的声明", function() {

		xit("can be declared 'xit'", function() {
				expect(true).toBe(false);
		});
		it("can be declared with 'it' but without a function");

		it("can be declared by calling 'pending' in the spec body", function() {
				expect(true).toBe(false);
				pending("this one won't be passed...");
		});
});

describe("A suite of jasmine's function : 对断言表达式的使用", function() {
		describe("How to use expect: ",function(){
				it("Expectations:",function(){
						expect("AAA").toEqual("AAA");
						expect(52.78).toMatch(/\d*.\d\d/);
						expect(null).toBeNull();
						expect("ABCD").toContain("B");
						expect(52,78).toBeLessThan(99);
						expect(52.78).toBeGreaterThan(18);

						var x = true;
						var y;
						expect(x).toBe(true);
						expect(x).toBeDefined();
						expect(y).toBeUndefined();
						expect(x).toBeTruthy();
						expect(!x).toBeFalsy();

						var fun = function() { return a + 1;};
						expect(fun).toThrow();
				});
				it("Not Expectations : ", function() {
						expect(false).not.toBe(true);
				});
				
				it("The 'toBeDefined' matcher compares against `undefined`", function() {
						var a = { foo: "foo" };
						expect(a.foo).toBeDefined();
						expect(a.bar).not.toBeDefined();
				});

				it("The `toBeUndefined` matcher compares against `undefined`", function() {
						var a = { foo: "foo" };
						expect(a.foo).not.toBeUndefined();
						expect(a.bar).toBeUndefined();
				});

				it("The 'toBeNull' matcher compares against null", function() {
						var a = null;
						var foo = "foo";
						expect(null).toBeNull();
						expect(a).toBeNull();
						expect(foo).not.toBeNull();
				});

				it("The 'toBeTruthy' matcher is for boolean casting testing", function() {
						var a, foo = "foo";
						expect(foo).toBeTruthy();
						expect(a).not.toBeTruthy();
				});

				it("The 'toBeFalsy' matcher is for boolean casting testing", function() {
						var a, foo = "foo";
						expect(a).toBeFalsy();
						expect(foo).not.toBeFalsy();
				});

				it("The 'toContain' matcher is for finding an item in an Array", function() {
						var a = ["foo", "bar", "baz"];
						expect(a).toContain("bar");
						expect(a).not.toContain("quux");
				});

				it("The 'toBeLessThan' matcher is for mathematical comparisons", function() {
						var pi = 3.1415926,	e = 2.78;
						expect(e).toBeLessThan(pi);
						expect(pi).not.toBeLessThan(e);
				});

				it("The 'toBeGreaterThan' matcher is for mathematical comparisons", function() {
						var pi = 3.1415926, e = 2.78;
						expect(pi).toBeGreaterThan(e);
						expect(e).not.toBeGreaterThan(pi);
				});

				it("The 'toBeCloseTo' matcher is for precision math comparison", function() {
						var pi = 3.1415926, e = 2.78;
						expect(pi).not.toBeCloseTo(e, 2);
						expect(pi).toBeCloseTo(e, 0);
				});

				it("The 'toThrow' matcher is for testing if a function throws an exception", function() {
						var foo = function() {
								return 1 + 2;
						};
						var bar = function() {
								return a + 1;
						};
						expect(foo).not.toThrow();
						expect(bar).toThrow();
				});

				it("The 'toThrowError' matcher is for testing a specific thrown exception", function() {
						var foo = function() {
								throw new TypeError("foo bar baz");
						};

						expect(foo).toThrowError("foo bar baz");
						expect(foo).toThrowError(/bar/);
						expect(foo).toThrowError(TypeError);
						expect(foo).toThrowError(TypeError, "foo bar baz");
				});
				
		});		
});


describe("A suite of jasmine's function : Matcher expressions", function() {
		
		it("The 'toMatch' matcher is for regular expressions", function() {
				var message = "foo bar baz";
				expect(message).toMatch(/bar/);
				expect(message).toMatch("bar");
				expect(message).not.toMatch(/quux/);
		});
});


describe("Asynchronous Support ： 对异步程序的单元测试",function(){
		var value;
		beforeEach(function(done) {
				setTimeout(function() {
						value = 0;
						done();
				}, 1);
		});
		
		it("should support async execution of test preparation and expectations", function(done) {
				value++;
				expect(value).toBeGreaterThan(0);
				done();
		});
		
		describe("long asynchronous specs", function() {
				beforeEach(function(done) {
						done();
				}, 1000);

				it("takes a long time", function(done) {
						setTimeout(function() {
						done();
						}, 9000);
				}, 10000);

				afterEach(function(done) {
						done();
				}, 1000);
		});
		/* Jasmine 2.0
		var value, flag;
		it("Asynchronous Support", function() {
				runs(function() {
						flag = false;
						value = 0;
						setTimeout(function() {
							flag = true;
						}, 500);
				});
				
				waitsFor(function() {
						value++;
						return flag;
				}, "The Value should be incremented", 750);

				runs(function() {
						expect(value).toBeGreaterThan(0);
				});
		});
		*/
});




describe("Setup and Teardown : 对开始前和使用后的变量赋值",function(){
		describe("--> beforeEach and afterEach : 次次初始化",function(){
				var foo;
				beforeEach(function() {
						foo = 0;
						foo += 1;
				});
				afterEach(function() {
						foo = 0;
				});

				it("is just a function, so it can contain any code", function() {
						expect(foo).toEqual(1);
						foo = 34453453423;
				});

				it("can have more than one expectation", function() {
						expect(foo).toEqual(1);
				});
		});

		describe("--> beforeAll and afterAll : 一次初始化，多次变更", function() {
				var foo;
				beforeAll(function() {
						foo = 1;
				});
				afterAll(function() {
						foo = 0;
				});

				it("sets the initial value of foo before specs run", function() {
						expect(foo).toEqual(1);
						foo += 1;
				});
				it("does not reset foo between specs", function() {
						expect(foo).toEqual(2);
				});
		});

		describe("--> Using 'this' to share variables : 使用‘this’关键字共享变量 ", function() {
				//var foo;
				beforeAll(function() {
						this.foo = 1;
				});
				afterAll(function() {
						this.foo = 0;
				});

				it("sets the initial value of foo before specs run", function() {
						expect(this.foo).toEqual(1);
				});
		});
});

