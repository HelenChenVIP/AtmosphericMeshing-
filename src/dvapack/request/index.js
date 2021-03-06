import URI from 'urijs';
import { getUseNetConfig, loadToken } from '../storage';
import { ShowToast } from '../../utils';
import {
  Platform,
} from 'react-native';


async function geturl(url, tooken) {
  const user = await loadToken();
  if (!tooken) {
    if (user != null) {
      url += `?authorCode=${user.UserCode}`;
     
    }
  } else if (tooken !== 'notooken') {
    url += `?authorCode=${tooken}`;
    
  }
  return url;
}

const fetchtimeout = (requestPromise, timeout = 30000) => {
  let timeoutAction = null;
  const timerPromise = new Promise((resolve, reject) => {
    timeoutAction = () => {
      reject('请求超时');
    };
  });
  setTimeout(() => {
    timeoutAction();
  }, timeout);
  return Promise.race([requestPromise, timerPromise]);
};


async function request(url, _options) {
  let neturl;
  let uri;
  if(Platform.OS==='android'){ 
     neturl  = await getUseNetConfig();
     if(url=='/rest/AtmosphereApi/PointAndData/GetPointList?authorCode=1b1994ec-538f-4d2f-b4f9-3c0e6950a806' ||
        url=='/rest/AtmosphereApi/Hour/GetHourData?authorCode=1b1994ec-538f-4d2f-b4f9-3c0e6950a806' ||
        url=='/rest/AtmosphereApi/Day/GetDayData?authorCode=1b1994ec-538f-4d2f-b4f9-3c0e6950a806'){
      uri = new URI(neturl.neturl + '/WebGrid_Api' + url);
     }else{
      uri = new URI(neturl.neturl  + url);
     }
  }else{
    if(url=='/rest/AtmosphereApi/PointAndData/GetPointList?authorCode=1b1994ec-538f-4d2f-b4f9-3c0e6950a806' ||
    url=='/rest/AtmosphereApi/Hour/GetHourData?authorCode=1b1994ec-538f-4d2f-b4f9-3c0e6950a806' ||
    url=='/rest/AtmosphereApi/Day/GetDayData?authorCode=1b1994ec-538f-4d2f-b4f9-3c0e6950a806'){
    neturl = 'https://api.chsdl.cn/GridWebApi/WebGrid_Api';
    uri = new URI(neturl + url);
    }else{
      neturl = 'https://api.chsdl.cn/GridWebApi';
      uri = new URI(neturl + url);
    }
    
  }
  const options = _options || {};
  options.method = options.method || 'GET';
  options.headers = options.headers || {};
  if (__DEV__) {
    if (options.body) {
    }
  }
  const resp = await fetch(uri.toString(), options);
  const text = await resp.text();
  const json = await JSON.parse(text);
  // 如果请求失败
  if (resp.status !== 200) {
    if (resp.status === 401) {
      ShowToast(`服务器故障${resp.status}`);
    }
  }
  if (json.requstresult) {
    if (json && json != null) {
      if (json.requstresult === '1') {
        return json;
      }
      ShowToast(json.reason);
      return null;
    }
    return null;
  }
}
export function test(url, params) {
  const jsonBody = JSON.stringify(params.body);
  const myFetch = fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: jsonBody,
  });
  return new Promise((resolve, reject) => {
    fetchtimeout(myFetch, 5000)
      .then(response => response.json())
      .then((responseData) => {
        resolve(responseData);
        return true;
      })
      .catch((error) => {
        reject(error);
        return false;
      });
  });
}
// file: {uri}
export async function upload(url, body, optionscall, tooken) {
  // const { neturl } = await getUseNetConfig();
  const neturl = 'https://api.chsdl.cn/GridWebApi';
  url = await geturl(url, tooken);
  const uri = new URI(neturl + url);
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    ...optionscall
  };
  const resp = await fetch(uri.toString(), options);
  const text = await resp.text();


  const json = JSON.parse(text);

  // 如果请求失败
  if (resp.status !== 200) {
    if (resp.status === 401) {
      ShowToast(`服务器故障${resp.status}`);
    }
  }

  if (json.requstresult) {
    if (json && json != null) {
      if (json.requstresult === '1') {
        return json;
      }
      ShowToast(json.reason);
      return null;
    }
    return null;
  }
 
  return json;
}
export async function get(url, params, options, tooken) {
  if (params) {  
    const paramsArray = [];
    // encodeURIComponent
    Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
    url = await geturl(url, tooken);
    if (url.indexOf('?') === -1) {
      if (url.search(/\?/) === -1) {
        url += `?${paramsArray.join('&')}`;
      } else {
        url += `&${paramsArray.join('&')}`;
      }
    } else {
      url += `&${paramsArray.join('&')}`;
    }
  }
 
  return request(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...options,
  });
}

export async function post(url, data, options, tooken) {
  url = await geturl(url, tooken);
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    ...options,
  });
}

export async function posturl(url, params, options, tooken) {
 
  if (params) {
    const paramsArray = [];
    // encodeURIComponent
    Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
    url = await geturl(url, tooken);
    if (url.indexOf('?') === -1) {
      if (url.search(/\?/) === -1) {
        url += `?${paramsArray.join('&')}`;
      } else {
        url += `&${paramsArray.join('&')}`;
      }
    } else {
      url += `&${paramsArray.join('&')}`;
    }
  }
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
}
