export const CallbackId = {
    WfhStart: `wfh_start`,
} as const
type CallbackId = typeof CallbackId[keyof typeof CallbackId]


export const Command = {
    WfhStart: `/wfh_start`,
} as const
type Command = typeof Command[keyof typeof Command]