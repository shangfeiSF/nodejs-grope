// 声明处理函数集合
var methods = {
  display: function (options, dataArr) {
    var data = dataArr.pop()

    var separator = ' '
    var data = ["<p>", data.from, 'SEND', data.message, 'TO', data.to]
    var end = ["</p>"]
    var timeStamp = ''

    if (options.hasOwnProperty('timeStamp') && options.timeStamp === true) {
      timeStamp = new Date()
      data = data.concat(['at', timeStamp]).concat(end)
    }else{
      data = data.concat(end)
    }

    console.log(options.identifier, '----', options.desc)

    $("#log").prepend(data.join(separator));
  },

  illegal: function(options, dataArr){
    var data = dataArr.pop()
    if (window.console) {
      var str = data.message
      console.warn(str);
    }
  },

  log: function (options, dataArr) {
    var data = dataArr.pop()
    if (window.console) {
      console.info(data);
    }
  }
}

// 声明上下文集合
var contexts = {
  'dev': {
    'env': 'development',
    'context': {
      'debug': $
    }
  },
  'pro': {
    'env': 'production',
    'context': { }
  },
  'win': {
    'env': 'window',
    'context': window
  }
}

// 初始化中介者
var mediator_code = window.Mediator()
var mediator_rest = window.Mediator()

// 中介者 订阅主题 and 注册处理函数 and 配置 and 上下文
mediator_code.Subscribe({
  theme: "code",
  handle: methods.display,
  options: {
    'timeStamp': true,
    'desc': "This is coding"
  },
  context: contexts.dev
})

mediator_code.SubscribeInterrupt({
  theme: "code:develop",
  handle: methods.display,
  options: {
    'timeStamp': false,
    'desc': "This is coding for develop",
    'identifier': 'code@develop'
  },
  context: contexts.dev
})

mediator_code.Subscribe({
  theme: "code:debug",
  handle: methods.display,
  options: {
    'timeStamp': true,
    'desc': "This is coding for debug",
    'identifier': 'code$debug'
  },
  context: contexts.dev
})

mediator_code.Subscribe({
  theme: "code:develop:daily",
  handle: methods.display,
  options: {
    'timeStamp': false,
    'desc': "This is coding for develop on daily"
  },
  context: contexts.dev
})

mediator_code.Subscribe({
  theme: "code:develop:emergent",
  handle: methods.display,
  options: {
    'desc': "This is coding for develop on emergent",
    'timeStamp': true
  },
  context: contexts.dev
})

mediator_code.Subscribe({
  theme: "code:debug:emergent",
  handle: methods.display,
  options: {
    'desc': "This is coding for debug on emergent",
    'timeStamp': true
  },
  context: contexts.dev
})

mediator_rest.Subscribe({
  theme: "noon:rest",
  handle: methods.log,
  options: {
    'timeStamp': true
  },
  context: contexts.dev
})

$( "#chat" ).on( "submit", function(e) {
  e.preventDefault()

  var from = $("#from").val()
  var to = $("#to").val()
  var text = $("#msg").val()

  var subscriber_1 = mediator_code.RemoveSubscriber("code", "code#develop#daily")
  console.info(subscriber_1.ignore)

  var subscriber_2 = mediator_code.RecoverSubscriber("code", "code#develop#daily")
  console.info(subscriber_2.ignore)

  var subscriber_3 = mediator_code.RemoveSubscriber("code")
  console.info(subscriber_3)

  var subscriber_4 = mediator_code.RecoverSubscriber("code:develop")
  console.info(subscriber_4)

  var topic_1 = mediator_code.ChangeSubscriberDeep('code:develop', true)
  console.info(topic_1)

  mediator_code.Publish("code", {
    message: from,
    from: to,
    to: text
  });

  mediator_code.ChangeSubscriberDeep('code:develop', false)

  mediator_code.Publish("code:develop", {
    message: 'TEST',
    from: 'TEST',
    to: 'TEST'
  });

  mediator_code.RemoveSubscriber("code", "code#develop#debug")

  mediator_code.Publish("code:develop:debug", {
    message: text,
    from: from,
    to: to
  });
});

mediator_rest.Publish('noon:rest', {
  message: 'none need rest',
})