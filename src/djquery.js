(() => {
  // node_modules/micromodal/dist/micromodal.es.js
  function e(e2, t2) {
    for (var o2 = 0; o2 < t2.length; o2++) {
      var n2 = t2[o2];
      n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e2, n2.key, n2);
    }
  }
  function t(e2) {
    return function(e3) {
      if (Array.isArray(e3))
        return o(e3);
    }(e2) || function(e3) {
      if (typeof Symbol != "undefined" && Symbol.iterator in Object(e3))
        return Array.from(e3);
    }(e2) || function(e3, t2) {
      if (!e3)
        return;
      if (typeof e3 == "string")
        return o(e3, t2);
      var n2 = Object.prototype.toString.call(e3).slice(8, -1);
      n2 === "Object" && e3.constructor && (n2 = e3.constructor.name);
      if (n2 === "Map" || n2 === "Set")
        return Array.from(e3);
      if (n2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2))
        return o(e3, t2);
    }(e2) || function() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
  }
  function o(e2, t2) {
    (t2 == null || t2 > e2.length) && (t2 = e2.length);
    for (var o2 = 0, n2 = new Array(t2); o2 < t2; o2++)
      n2[o2] = e2[o2];
    return n2;
  }
  var n;
  var i;
  var a;
  var r;
  var s;
  var l = (n = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'], i = function() {
    function o2(e2) {
      var n2 = e2.targetModal, i3 = e2.triggers, a3 = i3 === void 0 ? [] : i3, r3 = e2.onShow, s2 = r3 === void 0 ? function() {
      } : r3, l2 = e2.onClose, c = l2 === void 0 ? function() {
      } : l2, d = e2.openTrigger, u = d === void 0 ? "data-micromodal-trigger" : d, f = e2.closeTrigger, h = f === void 0 ? "data-micromodal-close" : f, v = e2.openClass, g = v === void 0 ? "is-open" : v, m = e2.disableScroll, b = m !== void 0 && m, y = e2.disableFocus, p = y !== void 0 && y, w = e2.awaitCloseAnimation, E = w !== void 0 && w, k = e2.awaitOpenAnimation, M = k !== void 0 && k, A = e2.debugMode, C = A !== void 0 && A;
      !function(e3, t2) {
        if (!(e3 instanceof t2))
          throw new TypeError("Cannot call a class as a function");
      }(this, o2), this.modal = document.getElementById(n2), this.config = { debugMode: C, disableScroll: b, openTrigger: u, closeTrigger: h, openClass: g, onShow: s2, onClose: c, awaitCloseAnimation: E, awaitOpenAnimation: M, disableFocus: p }, a3.length > 0 && this.registerTriggers.apply(this, t(a3)), this.onClick = this.onClick.bind(this), this.onKeydown = this.onKeydown.bind(this);
    }
    var i2, a2, r2;
    return i2 = o2, (a2 = [{ key: "registerTriggers", value: function() {
      for (var e2 = this, t2 = arguments.length, o3 = new Array(t2), n2 = 0; n2 < t2; n2++)
        o3[n2] = arguments[n2];
      o3.filter(Boolean).forEach(function(t3) {
        t3.addEventListener("click", function(t4) {
          return e2.showModal(t4);
        });
      });
    } }, { key: "showModal", value: function() {
      var e2 = this, t2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      if (this.activeElement = document.activeElement, this.modal.setAttribute("aria-hidden", "false"), this.modal.classList.add(this.config.openClass), this.scrollBehaviour("disable"), this.addEventListeners(), this.config.awaitOpenAnimation) {
        var o3 = function t3() {
          e2.modal.removeEventListener("animationend", t3, false), e2.setFocusToFirstNode();
        };
        this.modal.addEventListener("animationend", o3, false);
      } else
        this.setFocusToFirstNode();
      this.config.onShow(this.modal, this.activeElement, t2);
    } }, { key: "closeModal", value: function() {
      var e2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, t2 = this.modal;
      if (this.modal.setAttribute("aria-hidden", "true"), this.removeEventListeners(), this.scrollBehaviour("enable"), this.activeElement && this.activeElement.focus && this.activeElement.focus(), this.config.onClose(this.modal, this.activeElement, e2), this.config.awaitCloseAnimation) {
        var o3 = this.config.openClass;
        this.modal.addEventListener("animationend", function e3() {
          t2.classList.remove(o3), t2.removeEventListener("animationend", e3, false);
        }, false);
      } else
        t2.classList.remove(this.config.openClass);
    } }, { key: "closeModalById", value: function(e2) {
      this.modal = document.getElementById(e2), this.modal && this.closeModal();
    } }, { key: "scrollBehaviour", value: function(e2) {
      if (this.config.disableScroll) {
        var t2 = document.querySelector("body");
        switch (e2) {
          case "enable":
            Object.assign(t2.style, { overflow: "" });
            break;
          case "disable":
            Object.assign(t2.style, { overflow: "hidden" });
        }
      }
    } }, { key: "addEventListeners", value: function() {
      this.modal.addEventListener("touchstart", this.onClick), this.modal.addEventListener("click", this.onClick), document.addEventListener("keydown", this.onKeydown);
    } }, { key: "removeEventListeners", value: function() {
      this.modal.removeEventListener("touchstart", this.onClick), this.modal.removeEventListener("click", this.onClick), document.removeEventListener("keydown", this.onKeydown);
    } }, { key: "onClick", value: function(e2) {
      (e2.target.hasAttribute(this.config.closeTrigger) || e2.target.parentNode.hasAttribute(this.config.closeTrigger)) && (e2.preventDefault(), e2.stopPropagation(), this.closeModal(e2));
    } }, { key: "onKeydown", value: function(e2) {
      e2.keyCode === 27 && this.closeModal(e2), e2.keyCode === 9 && this.retainFocus(e2);
    } }, { key: "getFocusableNodes", value: function() {
      var e2 = this.modal.querySelectorAll(n);
      return Array.apply(void 0, t(e2));
    } }, { key: "setFocusToFirstNode", value: function() {
      var e2 = this;
      if (!this.config.disableFocus) {
        var t2 = this.getFocusableNodes();
        if (t2.length !== 0) {
          var o3 = t2.filter(function(t3) {
            return !t3.hasAttribute(e2.config.closeTrigger);
          });
          o3.length > 0 && o3[0].focus(), o3.length === 0 && t2[0].focus();
        }
      }
    } }, { key: "retainFocus", value: function(e2) {
      var t2 = this.getFocusableNodes();
      if (t2.length !== 0)
        if (t2 = t2.filter(function(e3) {
          return e3.offsetParent !== null;
        }), this.modal.contains(document.activeElement)) {
          var o3 = t2.indexOf(document.activeElement);
          e2.shiftKey && o3 === 0 && (t2[t2.length - 1].focus(), e2.preventDefault()), !e2.shiftKey && t2.length > 0 && o3 === t2.length - 1 && (t2[0].focus(), e2.preventDefault());
        } else
          t2[0].focus();
    } }]) && e(i2.prototype, a2), r2 && e(i2, r2), o2;
  }(), a = null, r = function(e2) {
    if (!document.getElementById(e2))
      return console.warn("MicroModal: \u2757Seems like you have missed %c'".concat(e2, "'"), "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "ID somewhere in your code. Refer example below to resolve it."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<div class="modal" id="'.concat(e2, '"></div>')), false;
  }, s = function(e2, t2) {
    if (function(e3) {
      e3.length <= 0 && (console.warn("MicroModal: \u2757Please specify at least one %c'micromodal-trigger'", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "data attribute."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<a href="#" data-micromodal-trigger="my-modal"></a>'));
    }(e2), !t2)
      return true;
    for (var o2 in t2)
      r(o2);
    return true;
  }, { init: function(e2) {
    var o2 = Object.assign({}, { openTrigger: "data-micromodal-trigger" }, e2), n2 = t(document.querySelectorAll("[".concat(o2.openTrigger, "]"))), r2 = function(e3, t2) {
      var o3 = [];
      return e3.forEach(function(e4) {
        var n3 = e4.attributes[t2].value;
        o3[n3] === void 0 && (o3[n3] = []), o3[n3].push(e4);
      }), o3;
    }(n2, o2.openTrigger);
    if (o2.debugMode !== true || s(n2, r2) !== false)
      for (var l2 in r2) {
        var c = r2[l2];
        o2.targetModal = l2, o2.triggers = t(c), a = new i(o2);
      }
  }, show: function(e2, t2) {
    var o2 = t2 || {};
    o2.targetModal = e2, o2.debugMode === true && r(e2) === false || (a && a.removeEventListeners(), (a = new i(o2)).showModal());
  }, close: function(e2) {
    e2 ? a.closeModalById(e2) : a.closeModal();
  } });
  typeof window != "undefined" && (window.MicroModal = l);
  var micromodal_es_default = l;

  // node_modules/svelte/internal/index.mjs
  function noop() {
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a2, b) {
    return a2 != a2 ? b == b : a2 !== b || (a2 && typeof a2 === "object" || typeof a2 === "function");
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  var is_hydrating = false;
  function start_hydrating() {
    is_hydrating = true;
  }
  function end_hydrating() {
    is_hydrating = false;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    node.parentNode.removeChild(node);
  }
  function element(name) {
    return document.createElement(name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.wholeText !== data)
      text2.data = data;
  }
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = Promise.resolve();
  var update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  var seen_callbacks = /* @__PURE__ */ new Set();
  var flushidx = 0;
  function flush() {
    const saved_component = current_component;
    do {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i2 = 0; i2 < render_callbacks.length; i2 += 1) {
        const callback = render_callbacks[i2];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  var outroing = /* @__PURE__ */ new Set();
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
  function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
          on_destroy.push(...new_on_destroy);
        } else {
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i2) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i2 / 31 | 0] |= 1 << i2 % 31;
  }
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: null,
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i2, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i2], $$.ctx[i2] = value)) {
        if (!$$.skip_bound && $$.bound[i2])
          $$.bound[i2](value);
        if (ready)
          make_dirty(component, i2);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        start_hydrating();
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor, options.customElement);
      end_hydrating();
      flush();
    }
    set_current_component(parent_component);
  }
  var SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        const { on_mount } = this.$$;
        this.$$.on_disconnect = on_mount.map(run).filter(is_function);
        for (const key in this.$$.slotted) {
          this.appendChild(this.$$.slotted[key]);
        }
      }
      attributeChangedCallback(attr2, _oldValue, newValue) {
        this[attr2] = newValue;
      }
      disconnectedCallback() {
        run_all(this.$$.on_disconnect);
      }
      $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
      }
      $on(type, callback) {
        const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
        callbacks.push(callback);
        return () => {
          const index = callbacks.indexOf(callback);
          if (index !== -1)
            callbacks.splice(index, 1);
        };
      }
      $set($$props) {
        if (this.$$set && !is_empty($$props)) {
          this.$$.skip_bound = true;
          this.$$set($$props);
          this.$$.skip_bound = false;
        }
      }
    };
  }
  var SvelteComponent = class {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };

  // src/js/query.js
  function parseQuery(command) {
    const [scope, condition_exp] = parseScope(command);
    const conditions = parseConditions(condition_exp);
    if (conditions.error) {
      return conditions;
    } else {
      return {
        scope,
        conditions
      };
    }
  }
  function parseScope(query) {
    const rs1 = /from\s+(?<scope>.+?)\s+(?<conditions>where.+)/.exec(query);
    if (rs1) {
      return [rs1.groups.scope, rs1.groups.conditions];
    }
    const rs = /from\s+(?<scope>.+)/.exec(query);
    if (rs)
      return [rs.groups.scope, ""];
    return [null, query];
  }
  function parseConditions(expression) {
    if (expression.trim() == "")
      return [];
    const rs = /where\s+(.+)/.exec(expression);
    if (rs) {
      return rs[1].split(" and ").map((text2) => text2.trim()).map((text2) => parseCondition(text2));
    } else {
      return { error: "invalid query condition" };
    }
  }
  function parseCondition(expression) {
    const rs = /^(?<field>[a-zA-Z0-9_\.]+?)\s*(?<operator>=|\>|\>=|\<|\<=|is not null|is null|ilike|like)\s*(?<value>.*)/.exec(expression);
    if (rs) {
      return rs.groups;
    }
    return {
      error: `Bad expression "${expression}"`
    };
  }
  function buildUrlQuery({ scope, conditions }) {
    let path;
    if (scope) {
      path = `/${mapAlias(scope)}-/`;
    }
    const conditionQuery = conditions.map((condition) => buildConditionQuery(condition));
    const error = conditionQuery.find((item) => item.error != null);
    if (error) {
      return { error: error.error, path, query: null };
    } else {
      const query = conditionQuery.map((item) => `${item.field}=${item.value}`).join("&");
      return {
        path,
        query
      };
    }
  }
  function mapAlias(scope) {
    const parts = scope.split(".");
    const aliases = JSON.parse(localStorage.getItem("djquery-aliases") || "{}");
    parts[0] = aliases[parts[0]] || parts[0];
    return parts.join("/");
  }
  var operatorMap = {
    "=": "exact",
    ">": "gt",
    ">=": "gte",
    "<": "lt",
    "<=": "lte"
  };
  function buildConditionQuery(condition) {
    let { field, operator, value } = condition;
    field = field.replace(/\./g, "__");
    let op, val = value, result = [];
    switch (operator.trim()) {
      case "=":
        if (value == "true")
          val = "True";
        if (value == "false")
          val = "False";
        result = {
          field,
          value: val
        };
        break;
      case "is null":
        result = {
          field: `${field}__isnull`,
          value: "True"
        };
        break;
      case "is not null":
        result = {
          field: `${field}__isnull`,
          value: "False"
        };
        break;
      case "in":
        result = {
          field: `${field}__in`,
          value: JSON.parse(value.replace("(", "[").replace(")", "]")).join(",")
        };
        break;
      case "like":
        [op, val] = parseTextSearch(operator, value);
        result = {
          field: `${field}__${op}`,
          value: val
        };
        break;
      case "ilike":
        [op, val] = parseTextSearch(operator, value);
        result = {
          field: `${field}__${op}`,
          value: val
        };
        break;
      default:
        op = operatorMap[operator];
        if (op) {
          result = { field: `${field}__${op}`, value };
        } else {
          result = { error: `Operator ${operator} is not supported` };
        }
    }
    return result;
  }
  function parseTextSearch(operator, value) {
    value = value.replace(/'/g, "");
    let rs = /^%(.+)%$/.exec(value);
    let search = null;
    if (rs) {
      search = "contains";
      value = rs[1];
    } else {
      rs = /^%(.+)$/.exec(value);
      if (rs) {
        search = "startswith";
        value = rs[1];
      } else {
        rs = /^(.+)%$/.exec(value);
        if (rs) {
          search = "endswith";
          value = rs[1];
        } else {
          search = "exact";
          value = value;
        }
      }
    }
    if (operator == "ilike") {
      return [`i${search}`, value];
    }
    return [search, value];
  }

  // src/js/command.js
  function parseCommand(command) {
    const commandType = parseCommandType(command);
    let result;
    switch (commandType) {
      case "query":
        result = parseQuery(command);
        break;
      case "alias":
        result = parseAlias(command);
        break;
      default:
        result = {
          error: "Bad command"
        };
    }
    if (result.error) {
      return {
        commandType,
        error: result.error
      };
    } else {
      return {
        commandType,
        args: result
      };
    }
  }
  var commandTypeMap = {
    alias: "alias",
    from: "query",
    where: "query"
  };
  function parseCommandType(command) {
    const rs = /^(\w+)/.exec(command);
    if (rs && commandTypeMap[rs[1]]) {
      return commandTypeMap[rs[1]];
    }
  }
  function parseAlias(command) {
    const rs = /^alias\s+(.+)/.exec(command);
    if (rs) {
      const aliases = rs[1].split(",").map((item) => item.trim()).map((item) => parseAliasItem(item));
      const error = aliases.find((item) => item.error != null);
      return error || {
        aliases: Object.assign({}, ...aliases)
      };
    } else {
      return { error: "Invalid alias command" };
    }
  }
  function parseAliasItem(alias) {
    const rs = /^(\w+)\s+as\s+(\w+)$/.exec(alias);
    if (rs) {
      return { [rs[2]]: rs[1] };
    } else {
      return { error: `Invalid alias ${alias}` };
    }
  }
  var aliasStorageKey = "djquery-aliases";
  function execCommand({ commandType, args }) {
    switch (commandType) {
      case "alias":
        const aliases = JSON.parse(localStorage.getItem(aliasStorageKey) || "{}");
        localStorage.setItem(aliasStorageKey, JSON.stringify(Object.assign(aliases, args.aliases)));
        return { message: "Alias saved" };
      case "query":
        const { error, path, query } = buildUrlQuery(args);
        if (error) {
          return { error };
        } else {
          const url = new URL(window.location.href);
          if (path)
            url.pathname = path;
          if (query) {
            url.search = `?${query}`;
          } else {
            url.search = "";
          }
          window.location.href = url.href;
          return { message: "Query running ..." };
        }
      default:
        return { error: "Bad command" };
    }
  }

  // src/js/DjQuery.svelte
  function create_if_block(ctx) {
    let span;
    let t2;
    let span_class_value;
    return {
      c() {
        span = element("span");
        t2 = text(ctx[1]);
        attr(span, "class", span_class_value = "query-" + ctx[2]);
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t2);
      },
      p(ctx2, dirty) {
        if (dirty & 2)
          set_data(t2, ctx2[1]);
        if (dirty & 4 && span_class_value !== (span_class_value = "query-" + ctx2[2])) {
          attr(span, "class", span_class_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(span);
      }
    };
  }
  function create_fragment(ctx) {
    let div2;
    let div1;
    let div0;
    let textarea_1;
    let t2;
    let mounted;
    let dispose;
    let if_block = ctx[1] && create_if_block(ctx);
    return {
      c() {
        div2 = element("div");
        div1 = element("div");
        div0 = element("div");
        textarea_1 = element("textarea");
        t2 = space();
        if (if_block)
          if_block.c();
        attr(textarea_1, "id", "query-input");
        attr(textarea_1, "placeholder", "from scope.table where column_a = null");
        attr(textarea_1, "rows", "4");
        attr(div0, "class", "modal__container");
        attr(div0, "role", "dialog");
        attr(div0, "aria-modal", "true");
        attr(div1, "class", "modal__overlay");
        attr(div1, "tabindex", "-1");
        attr(div1, "data-micromodal-close", "");
        attr(div2, "class", "modal micromodal-slide");
        attr(div2, "id", "query-modal");
        attr(div2, "aria-hidden", "true");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div1);
        append(div1, div0);
        append(div0, textarea_1);
        ctx[4](textarea_1);
        append(div0, t2);
        if (if_block)
          if_block.m(div0, null);
        if (!mounted) {
          dispose = listen(textarea_1, "keyup", ctx[3]);
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (ctx2[1]) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block(ctx2);
            if_block.c();
            if_block.m(div0, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div2);
        ctx[4](null);
        if (if_block)
          if_block.d();
        mounted = false;
        dispose();
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let textarea;
    let message;
    let messageType;
    function onKeyUp(e2) {
      if (e2.key === "Enter" || e2.keyCode == 13) {
        const command = parseCommand(textarea.value);
        if (command.error) {
          $$invalidate(1, message = command.error);
          $$invalidate(2, messageType = "error");
        } else {
          const rs = execCommand(command);
          if (rs.error) {
            $$invalidate(1, message = rs.error);
            $$invalidate(2, messageType = "error");
          } else {
            $$invalidate(1, message = rs.message || "Success");
            $$invalidate(2, messageType = "success");
          }
        }
      }
    }
    function textarea_1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        textarea = $$value;
        $$invalidate(0, textarea);
      });
    }
    return [textarea, message, messageType, onKeyUp, textarea_1_binding];
  }
  var DjQuery = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {});
    }
  };
  var DjQuery_default = DjQuery;

  // src/js/index.js
  function injectHtml() {
    var elemDiv = document.createElement("div");
    elemDiv.id = "djquery";
    elemDiv.style.cssText = "";
    document.body.appendChild(elemDiv);
    try {
      new DjQuery_default({
        target: elemDiv
      });
    } catch (e2) {
      console.log(e2);
    }
  }
  function bindHotkey() {
    document.addEventListener("keydown", function(event) {
      if (event.ctrlKey && event.key === "k") {
        micromodal_es_default.show("query-modal");
      }
    });
  }
  function init2() {
    injectHtml();
    bindHotkey();
    micromodal_es_default.init();
  }
  init2();
})();
