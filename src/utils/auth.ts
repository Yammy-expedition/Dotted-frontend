// auth.ts

/**
 * 토큰 만료 여부를 체크하는 함수 (JWT 기준)
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('토큰 파싱 실패:', error);
    return true;
  }
}

/**
 * Refresh Token을 이용해 새 accessToken (및 refreshToken)이 발급되는 함수
 */
export async function refreshAccessToken(): Promise<void> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/api/user/refresh`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh: refreshToken })
    }
  );

  if (!response.ok) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  // 서버 응답에 맞춰 토큰 저장 (예: data.access, data.refresh)
  localStorage.setItem('accessToken', data.access);
  if (data.refresh) {
    localStorage.setItem('refreshToken', data.refresh);
  }
}

/**
 * 모든 HTTP 메서드에 대해 토큰 관리를 수행하는 공통 fetch 함수
 * - 요청 전 토큰 만료 체크 후 refreshAccessToken() 호출
 * - Authorization 헤더에 토큰 추가
 * - 401 응답 시 재시도 처리
 */
export async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  let accessToken = localStorage.getItem('accessToken');

  // 토큰 만료 여부 체크 후 필요 시 갱신
  if (isTokenExpired(accessToken)) {
    await refreshAccessToken();
    accessToken = localStorage.getItem('accessToken');
  }

  const finalOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type':
        (options.headers as Record<string, string>)?.['Content-Type'] ||
        'application/json'
    }
  };

  // console.log(url, finalOptions, 'okay now2');
  let response = await fetch(url, finalOptions);

  // console.log('wait');
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // console.log('go');

  // console.log(response, 'okay now3');

  // 만약 401 Unauthorized 응답이면 다시 시도 (토큰이 갱신된 경우)
  if (response.status === 401) {
    try {
      await refreshAccessToken();
      accessToken = localStorage.getItem('accessToken');
      response = await fetch(url, {
        ...finalOptions,
        headers: {
          ...finalOptions.headers,
          Authorization: `Bearer ${accessToken}`
        }
      });

      // console.log(response, 'okay now4');
    } catch (error) {
      throw new Error('Token refresh failed, please login again.');
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  // 응답 본문이 없는 경우(JSON 파싱하지 않음)
  if (response.status === 204 || response.status === 205) {
    return null as unknown as T;
  }

  const text = await response.text();
  if (!text) {
    return null as unknown as T;
  }

  return JSON.parse(text) as T;
}
