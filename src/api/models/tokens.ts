import * as moment from 'moment'
import * as mongoose from 'mongoose'
import * as sbase from '@nodeswork/sbase'

import { generateToken } from '../../utils/tokens'

const MAX_DATE = new Date(8640000000000000)

export interface TokenType extends TokenTypeT {}
export type TokenTypeT = typeof Token & sbase.mongoose.NModelType

export class Token extends sbase.mongoose.NModel {

  static $CONFIG: sbase.mongoose.ModelConfig = {
    collection:        'tokens',
    discriminatorKey:  'kind',
  }

  static $SCHEMA = {

    token:            {
      type:           String,
      index:          true,
      required:       true,
      default:        generateToken,
    },

    redeemTimesLeft:  {
      type:           Number,
      default:        0,
    },

    payload:          {
      kind:           String,
      data:           {
        type:         mongoose.Schema.Types.ObjectId,
        refPath:      'payload.kind',
      }
    },

    expireAt:         {
      type:           Date,
      required:       true,
    },
  }

  static async createToken(
    payload: sbase.mongoose.NModel, options: TokenOptions
  ): Promise<Token> {
    let self = this.cast<Token>();
    let expireAt = !options.expireInMs ? MAX_DATE :
      moment().add(options.expireInMs, 'ms');
    let redeemTimesLeft = options.maxRedeemTimes || 1;

    let doc = {
      redeemTimesLeft,
      payload: {
        kind: payload.baseModelName,
        data: payload._id,
      },
      expireAt,
    };
    return self.create(doc);
  }

  static async redeemToken(token: string): Promise<Token> {
    let self = this.cast<Token>();
    let query = {
      token,
      redeemTimesLeft: {
        $ne: 0,
      },
      expireAt: {
        $lt: Date.now(),
      },
    };
    return self
      .findOneAndUpdate(query, { redeemTimesLeft: { $dec: 1 }})
      .populate('payload.data');
  }
}

export interface TokenOptions {
  expireInMs:      number   // 0 means no expiration
  maxRedeemTimes:  number   // -1 means no limitation
}
