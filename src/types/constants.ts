export const CallbackId = {
    WfhStart: `wfh_start`,
    WfhEnd: `wfh_end`,
    WfhEdit: `wfh_edit`,
} as const
type CallbackId = typeof CallbackId[keyof typeof CallbackId]


export const Command = {
    WfhStart: `/wfh_start`,
    WfhEnd: `/wfh_end`,
    WfhEdit: `/wfh_edit`,
} as const
type Command = typeof Command[keyof typeof Command]
