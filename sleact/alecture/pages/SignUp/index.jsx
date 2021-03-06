import React, { useCallback, useEffect, useState } from 'react';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from './styles';
import useInputs from '@hooks/useInputs';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { NavLink, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const { data: userData } = useSWR('/api/users', fetcher);

  const [{ email, nickname }, onChange, reset] = useInputs({
    email: '',
    nickname: '',
  });
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [misMatchError, setMisMatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMisMatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMisMatchError(e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!misMatchError && nickname) {
        setSignUpError('');
        setSignUpSuccess(false);
        axios
          .post(`/api/users`, {
            email,
            nickname,
            password,
          })
          .then((res) => {
            console.log(res);
            setSignUpSuccess(true);
          })
          .catch((err) => {
            console.error(err);
            setSignUpError(err.response.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, misMatchError],
  );

  useEffect(() => {
    if (userData) {
      navigate('/workspace/sleact/channel/일반');
    } else if (userData === undefined) {
      return <div>로딩중 ...</div>;
    }
  }, [navigate, userData]);

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChange} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChange} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="passwordCheck"
              name="passwordCheck"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {misMatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <NavLink to="/login">로그인 하러가기</NavLink>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
