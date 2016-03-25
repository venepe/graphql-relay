
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.subscriptionWithClientSubscriptionId = subscriptionWithClientSubscriptionId;

var _graphql = require('graphql');

function resolveMaybeThunk(thingOrThunk) {
  return typeof thingOrThunk === 'function' ? thingOrThunk() : thingOrThunk;
}

/**
 * A description of a subscription consumable by subscriptionWithClientSubscriptionId
 * to create a GraphQLFieldConfig for that subscription.
 *
 * The inputFields and outputFields should not include `clientSubscriptionId`,
 * as this will be provided automatically.
 *
 * An input object will be created containing the input fields, and an
 * object will be created containing the output fields.
 *
 * mutateAndGetPayload will receieve an Object with a key for each
 * input field, and it should return an Object with a key for each
 * output field. It may return synchronously, or return a Promise.
 */

/**
 * Returns a GraphQLFieldConfig for the subscription described by the
 * provided SubscriptionConfig.
 */

function subscriptionWithClientSubscriptionId(config) {
  var name = config.name;
  var inputFields = config.inputFields;
  var outputFields = config.outputFields;
  var mutateAndGetPayload = config.mutateAndGetPayload;

  var augmentedInputFields = function augmentedInputFields() {
    return _extends({}, resolveMaybeThunk(inputFields), {
      clientSubscriptionId: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
      }
    });
  };
  var augmentedOutputFields = function augmentedOutputFields() {
    return _extends({}, resolveMaybeThunk(outputFields), {
      clientSubscriptionId: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
      }
    });
  };

  var outputType = new _graphql.GraphQLObjectType({
    name: name + 'Payload',
    fields: augmentedOutputFields
  });

  var inputType = new _graphql.GraphQLInputObjectType({
    name: name + 'Input',
    fields: augmentedInputFields
  });

  return {
    type: outputType,
    args: {
      input: { type: new _graphql.GraphQLNonNull(inputType) }
    },
    resolve: function resolve(_, _ref, info) {
      var input = _ref.input;

      return _Promise.resolve(mutateAndGetPayload(input, info)).then(function (payload) {
        payload.clientSubscriptionId = input.clientSubscriptionId;
        return payload;
      });
    }
  };
}
