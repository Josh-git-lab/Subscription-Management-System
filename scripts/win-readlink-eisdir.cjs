"use strict";

/**
 * Node on Windows returns EISDIR from fs.readlink for ordinary files.
 * Next.js only treats EINVAL as "not a symlink", so production builds fail
 * on the first traced file (often src/app/favicon.ico). Rewrite that code
 * before Next loads. Linux readlink(file) already returns EINVAL.
 */
const fs = require("fs");

function asNotASymlink(err) {
  if (err && err.code === "EISDIR" && (!err.syscall || err.syscall === "readlink")) {
    err.code = "EINVAL";
  }
  return err;
}

const readlink = fs.readlink;
fs.readlink = function readlinkPatched(path, options, callback) {
  if (typeof options === "function") {
    callback = options;
    return readlink.call(fs, path, function onReadlink(err, linkString) {
      callback(asNotASymlink(err), linkString);
    });
  }
  return readlink.call(fs, path, options, function onReadlink(err, linkString) {
    callback(asNotASymlink(err), linkString);
  });
};

const readlinkSync = fs.readlinkSync;
fs.readlinkSync = function readlinkSyncPatched(path, options) {
  try {
    return readlinkSync.call(fs, path, options);
  } catch (err) {
    throw asNotASymlink(err);
  }
};

const readlinkPromise = fs.promises.readlink.bind(fs.promises);
fs.promises.readlink = async function readlinkPromisePatched(path, options) {
  try {
    return await readlinkPromise(path, options);
  } catch (err) {
    throw asNotASymlink(err);
  }
};
