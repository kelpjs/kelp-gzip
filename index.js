const zlib   = require('zlib');
/**
 * [function description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
module.exports = function(req, res, next){
  var write = res.write, end = res.end;
  var accept = req.headers['accept-encoding'];
  if(accept) accept = accept.split(/,\s?/);
  var gzip = zlib.createGzip();
  gzip.on('data', write.bind(res))
      .on('end' ,   end.bind(res));

  res.setHeader('Content-Encoding', 'gzip');
  res.setHeader('Vary', 'Accept-Encoding');
  res.removeHeader('Content-Length');
  /**
   * [function description]
   * @return {[type]} [description]
   */
  res.write = function(){
    gzip.write.apply(gzip, arguments);
    return res;
  };
  /**
   * [function description]
   * @return {[type]} [description]
   */
  res.end = function(){
    gzip.end.apply(gzip, arguments);
    return res;
  };
  next();
};
