import { Schema, model } from "mongoose";
import {
  ISubscription,
  SubscriptionDocument,
  SubscriptionModel,
} from "../interfaces";

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Subscription: SubscriptionModel = model<
  SubscriptionDocument,
  SubscriptionModel
>("Subscription", subscriptionSchema);
