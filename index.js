const zlib = require('zlib');

const encodingMethods = {
  gzip: zlib.createGzip,
  deflate: zlib.createDeflate
}

/**
 * [function description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
module.exports = function (req, res, next) {
  const write = res.write,
          end = res.end;
  const accept = req.headers['accept-encoding'];
  if (accept) accept = accept.split(/,\s?/);
  const encoding = accept[0];
  if (!encoding) {
    console.warn('supported encodings: gzip, deflate, identity');
    return next();
  }
  const compressor = encodingMethods[encoding]();
  compressor
    .on('data', write.bind(res))
    .on('end',    end.bind(res));

  res.setHeader('Content-Encoding', encoding);
  res.setHeader('Vary', 'Accept-Encoding');
  res.removeHeader('Content-Length');
  /**
   * [function description]
   * @return {[type]} [description]
   */
  res.write = function () {
    compressor.write.apply(compressor, arguments);
    return res;
  };
  /**
   * [function description]
   * @return {[type]} [description]
   */
  res.end = function () {
    compressor.end.apply(compressor, arguments);
    return res;
  };
  next();
};