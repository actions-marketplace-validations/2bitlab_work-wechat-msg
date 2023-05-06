/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from '@actions/core'
// debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

import axios from 'axios'

type MsgType = 'text' | 'markdown'

interface Parmas {
   
    msgtype: MsgType
    markdown?: string
    text?: {
        content: string
        mentioned_mobile_list?: string[]
    }
}

const sendMsgToWeChat = async (botKey: string, props: Parmas): Promise<void> => {
    try {
      await axios({
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        url: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${botKey}`,
        data: props
      })
    } catch (error) {
      if (error instanceof Error) core.setFailed(error.message)
    }
  }


async function run(): Promise<void> {
  try {
    const botKey: string = core.getInput('botKey')
    const content: string = core.getInput('content')

    const msgtype: MsgType = core.getInput('msgtype') as MsgType || 'markdown'
    const markdown: string = core.getInput('markdown')

    const mentionedMobileList: string[] = (core.getInput('mentionedMobileList') || '').split(',')

  
    core.debug(`botKey: ${botKey}`)
    core.debug(`content: ${content}`)
    core.debug(`msgtype: ${msgtype}`)
    core.debug(`markdown: ${markdown}`)
    core.debug(`mentionedMobileList: ${mentionedMobileList}`)

    const props: Parmas = {
        msgtype,
        markdown,
    }

    if (msgtype === 'text') {
        props.text = {
            content,
            mentioned_mobile_list: mentionedMobileList
        }
    }
   
    await sendMsgToWeChat(botKey, props)
    

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
