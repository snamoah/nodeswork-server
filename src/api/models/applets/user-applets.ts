import * as _            from 'underscore';
import * as mongoose     from 'mongoose';
import * as sbase        from '@nodeswork/sbase';

import * as models       from '../../models';

export const USER_APPLET_DATA_LEVELS = {
  DETAIL:  'DETAIL',
};

export type UserAppletTypeT = typeof UserApplet & sbase.mongoose.NModelType;
export interface UserAppletType extends UserAppletTypeT {}

const UserAppletDeviceConfig = new mongoose.Schema({
  device:      {
    type:      mongoose.Schema.Types.ObjectId,
    ref:       'Device',
    required:  true,
  },
}, { _id: false });

const UserAppletConfig = new mongoose.Schema({
  appletConfig:  {
    type:        mongoose.Schema.Types.ObjectId,
    required:    true,
  },
  devices:       [ UserAppletDeviceConfig ],
}, { _id: false });

export class UserApplet extends sbase.mongoose.NModel {

  public static $CONFIG: mongoose.SchemaOptions = {
    collection:        'users.applets',
    dataLevel:         {
      levels:          [ USER_APPLET_DATA_LEVELS.DETAIL ],
      default:         USER_APPLET_DATA_LEVELS.DETAIL,
    },
    toObject:          {
      virtuals:        true,
    },
    id: false,
  };

  public user:             mongoose.Schema.Types.ObjectId;
  public applet:           mongoose.Schema.Types.ObjectId | object;
  public config:           UserAppletConfig;
  public enabled:          boolean;

  public static $SCHEMA: object = {

    user:             {
      type:           mongoose.Schema.Types.ObjectId,
      ref:            'User',
      required:       true,
      index:          true,
      api:            sbase.mongoose.READONLY,
    },

    applet:           {
      type:           mongoose.Schema.Types.ObjectId,
      ref:            'Applet',
      required:       true,
      api:            sbase.mongoose.READONLY,
    },

    config:           {
      type:           UserAppletConfig,
      required:       true,
    },

    enabled:          {
      type:           Boolean,
      default:        false,
    },
  };
}

export interface UserAppletConfig {
  appletConfig:  mongoose.Schema.Types.ObjectId;
  devices:       UserAppletDeviceConfig[];
}

export interface UserAppletDeviceConfig {
  device: models.Device;
}
