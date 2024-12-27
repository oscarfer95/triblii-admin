import { Log } from "../models/log.model";

export function getLog(itemId: string, action: string, moduleId: string, userId: string) {
    let log: Log = new Log();
    log.ItemId = itemId;
    log.action = action;
    log.moduleId = moduleId;
    log.date = new Date();
    log.userId = userId;

    return log;
  }