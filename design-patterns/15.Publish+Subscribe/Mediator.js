(function (root) {
  var MediatorSequence = 0

  function guidGenerator(identifier) {
    // 消息处理对象的guid生成器，预留扩展空间
    return identifier
  }

  // Subscriber 实例与 Mediator 实例的消息树中节点绑定
  function Subscriber(handle, options, context) {
    // js构造函数的安全作用域
    if (this instanceof Subscriber) {
      // handle 是由 context 和 options 卡瑞化的方法
      this.handle = handle.bind(context, options)
      this.ignore = false
      this._guid = guidGenerator(options.identifier)
      this._context = context
      this._options = options
      this._topic = null
    } else {
      return new Subscriber(fn, context, options)
    }
  }

  // Topic 实例是 Mediator 实例的消息树节点
  function Topic(namespace, deep) {
    // js构造函数的安全作用域
    if (this instanceof Topic) {
      this.namespace = namespace || ""
      this.subscribers = []
      this.topics = {}
      this.deep = deep || false
    } else {
      return new Topic(namespace)
    }
  }

  Topic.prototype = {
    AddSubscriber: function (handle, options, context) {

      var subscriber = new Subscriber(handle, options, context)

      subscriber._topic = this

      this.subscribers.push(subscriber)

      return subscriber;
    },

    GetSubscriber: function (identifier) {
      var subscribers = this.subscribers
      var length = subscribers.length
      var i = 0
      while (i < length) {
        var subscriber = subscribers[i]
        if (subscriber._guid === identifier) {
          return subscriber
        }
        i++
      }

      var topics = this.topics
      for (var p in  topics) {
        if (topics.hasOwnProperty(p)) {
          var deeper_subscriber = topics[p].GetSubscriber(identifier)
          if (deeper_subscriber) {
            return deeper_subscriber
          }
        }
      }
    },

    hasTopic: function (topic) {
      return this.topics.hasOwnProperty(topic);
    },

    addTopic: function (config) {
      var topic = config.topic
      var deep = config.deep
      var namespace = topic
      if (this.namespace) {
        namespace = this.namespace + ":" + topic
      }

      this.topics[topic] = new Topic(namespace, deep)
    },

    ReturnTopic: function (topic) {
      return this.topics[topic];
    },

    SetDeep: function (deep) {
      this.deep = deep
      return this
    },

    SetIgnore: function (identifier, state) {
      // 清空全部的 subscribers
      var topics = this.topics
      var subscribers = this.subscribers
      var length = subscribers.length

      if (!identifier) {
        // ignoreRoot 的第一个元素是子树的根节点，之后依次是子树的子数
        var ignoreRoot = [this.namespace]
        subscribers.ignoreAll = state
        for (var p in topics) {
          if (topics.hasOwnProperty(p)) {
            ignoreRoot.push(topics[p].SetIgnore(identifier, state))
          }
        }
        return ignoreRoot
      } else {
        var result
        var i = 0
        while (i < length) {
          var subscriber = subscribers[i]
          if (subscriber._guid === identifier) {
            subscriber.ignore = state
            return subscriber
          }
          i++
        }
        for (var p in  topics) {
          if (topics.hasOwnProperty(p)) {
            result = topics[p].SetIgnore(identifier, state)
            if (result) {
              return result
            }
          }
        }
      }
    },

    RemoveSubscriber: function (identifier) {
      return this.SetIgnore(identifier, true)
    },

    RecoverSubscriber: function (identifier) {
      return this.SetIgnore(identifier, false)
    },

    Publish: function (dataArr) {
      var subscribers = this.subscribers
      if (subscribers.ignoreAll !== true) {
        var length = subscribers.length
        var i = 0
        while (i < length) {
          var subscriber = subscribers[i]
          if (!subscriber.ignore) {
            subscriber.handle([].concat(dataArr))
          }
          i++
        }
      }

      var topics = this.topics
      for (var p in topics) {
        if (this.deep) {
          if (topics.hasOwnProperty(p)) {
            topics[p].Publish([].concat(dataArr));
          }
        }
      }
    }
  }

  // Mediator 实例是中介者
  function Mediator(MediatorName) {
    // js构造函数的安全作用域
    if (this instanceof Mediator) {
      // focus 是中介者维护的消息树
      this.focus = new Topic(MediatorName || 'Mediator' + (MediatorSequence++))
    } else {
      return new Mediator()
    }
  };

  Mediator.prototype = {
    // 按照 theme 规定的层次为 Mediator 的实例逐层添加 topic
    GetTopic: function (theme, deep) {
      // this 指向 Mediator 中介者的实例，focus 属性是中介者关心的主题（也是 Topic 的实例）
      var focus = this.focus
      if (theme === "") {
        return focus
      }

      // theme（主题）是由 topic （话题）以":"连接的
      var hierarchy = theme.split(":")
      var levels = hierarchy.length
      var l = 0
      while (l < levels) {
        var topic = hierarchy[l]
        if (!focus.hasTopic(topic)) {
          focus.addTopic({
            topic: topic,
            deep: deep
          })
        }
        focus = focus.ReturnTopic(topic);
        l++
      }

      return focus;
    },

    // 订阅 theme 注册由 options 与 context 卡瑞化的 handle
    SetSubscribe: function (deep, config) {
      var theme = config.theme
      var options = config.options || {}
      var context = config.context || {}

      if (!options.identifier) {
        options.identifier = theme.split(":").join('#')
      }

      var topic = this.GetTopic(theme, deep)
      // 注册由 options 与 context 卡瑞化的 handle
      var subscriber = topic.AddSubscriber(config.handle, options, context);

      return subscriber
    },

    /*
     Subscribe 和 SubscribeInterrupt 看似是 SetSubscribe 的卡瑞化
     但是在声明原型对象时是无法利用 bind 进行 SetSubscribe卡瑞化
     原因：.bind(this) 中 this 是实例化 Mediator 时
     要么 Subscribe 和 SubscribeInterrupt 作为 Mediator 实例的实例属性
     要么 Mediator.prototype 上的 Subscribe 和 SubscribeInterrupt 与首个实例绑定
     要么 Mediator.prototype 上的 Subscribe 和 SubscribeInterrupt 与最后实例绑定
     总之在声明原型对象时使用 bind 对方法进行卡瑞化存在很多弊端
     */
    Subscribe: function (config) {
      this.SetSubscribe(true, config)
    },

    SubscribeInterrupt: function (config) {
      this.SetSubscribe(false, config)
    },

    // 获取在 theme 下 identifier 定义的 Subscriber 实例
    GetSubscriber: function (theme, identifier) {
      var topic = this.GetTopic(theme || "")
      return topic.GetSubscriber(identifier)
    },

    // 删除在 theme 下 identifier 定义的 Subscriber 实例(不是真的删除，ignore置位)
    RemoveSubscriber: function (theme, identifier) {
      var topic = this.GetTopic(theme || "")
      topic = topic.RemoveSubscriber(identifier)
      return topic
    },

    RecoverSubscriber: function (theme, identifier) {
      var topic = this.GetTopic(theme || "")
      topic = topic.RecoverSubscriber(identifier);
      return topic
    },

    ChangeSubscriberDeep: function (theme, deep) {
      var result
      if (theme) {
        var topic = this.GetTopic(theme)
        result = topic.SetDeep(deep)
      }
      return result
    },

    // 发布 theme
    Publish: function (theme) {
      // args 是 theme 的附属数据
      var dataArr = Array.prototype.slice.call(arguments, 1)

      var topic = this.GetTopic(theme)

      topic.Publish(dataArr)
    }
  }

  root.Mediator = Mediator
})(window)