import React from 'react'

function docsPage() {
  return (
    <div>
      
      <h1>Docs</h1>
      <h2>Authentication</h2>
      <p>모튼 통신은 x-www-form-urlencoded 된 상태로 이루어져야 합니다.</p>
      <h3>토큰 발급</h3>
      <p>토큰 발급은 http://dig04214.ddns.net:59900/oauth/v1/token 에 body 안에 변수를 담아 HTTP POST요청을 보내야 합니다.</p>
      <p>필요한 변수는 다음과 같습니다</p>
      <pre>
        <code>
          client_id: 서비스를 등록할 때 부여받은 client ID<br/>
          client_secret: 서비스를 등록할 때 부여받은 client secret<br/>
          grant_type: 반드시 client_credentials으로 입력해야 합니다.<br/>
          scope: 토큰에 부여할 권한을 입력합니다. 여러개의 권한을 부여할 경우 공백으로 구분합니다. 부여 가능한 권한은 read, write, manage이며 등록한 service ID:[권한] 형식으로 작성합니다.<br/>
        </code>
      </pre>
      <p>요청이 성공적이면, 다음과 같은 형태로 access token을 받을 수 있습니다.</p>
      <pre>
        <code>
          <p>{'{'} </p>
          <p>  "status": 200,</p>
          <p>  "data": {'{'}</p>
          <p>    "access_token": your_access_token,</p>
          <p>    "expire_in": expire_in_seconds,</p>
          <p>    "scopes": {'['}</p>
          <p>      token_scopes</p>
          <p>    {']'}, </p>
          <p>    "token_type": "bearer"</p>
          <p>  {'}'}</p>
          <p>{'}'}</p>
        </code>
      </pre>

      <h3>토큰 조회</h3>
      <p>토큰 조회는 http://dig04214.ddns.net:59900/oauth/v1/validate 에 header에 변수를 담아 HTTP GET요청을 보내야 합니다.</p>
      <p>필요한 변수는 다음과 같습니다</p>
      <pre>
        <code>
          Authentication: Bearer {'<'}your_access_token{'>'}<br/>
        </code>
      </pre>
      <p>요청이 성공적이면, 다음과 같은 JSON을 받을 수 있습니다.</p>
      <pre>
        <code>
          <p>{'{'} </p>
          <p>  "client_id": your_client_id,</p>
          <p>  "scopes": {'['}</p>
          <p>    token_scopes</p>
          <p>  {']'}, </p>
          <p>  "expire_in": "expire_in_seconds"</p>
          <p>  {'}'}</p>
          <p>{'}'}</p>
        </code>
      </pre>

      <h3>토큰 폐기</h3>
      <p>토큰 폐기는 http://dig04214.ddns.net:59900/oauth/v1/revoke 에 body에 변수를 담아 HTTP POST요청을 보내야 합니다.</p>
      <p>필요한 변수는 다음과 같습니다</p>
      <pre>
        <code>
          client_id: 서비스를 등록할 때 부여받은 client ID<br/>
          token: 폐기할 토큰<br/>
        </code>
      </pre>
      <p>요청이 성공적이면, body 없이 HTTP status code 200 OK만 받을 수 있습니다.</p>
      

    </div>
  )
}

export default docsPage