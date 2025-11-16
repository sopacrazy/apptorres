import React, { useState } from 'react';
import { WifiIcon } from './ui/Icons';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '123') {
      setError('');
      onLogin();
    } else {
      setError('Login ou senha inválidos.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
        <div className="text-center mb-8">
            <WifiIcon className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-3xl font-bold text-neutral mt-4">TorresApp</h1>
            <p className="text-gray-500">Controle financeiro para seu provedor</p>
        </div>
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          <h2 className="text-xl font-semibold text-center text-neutral">Acessar o Sistema</h2>
          <Input 
            label="Usuário" 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            autoComplete="username"
          />
          <Input 
            label="Senha" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            autoComplete="current-password"
          />
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </Card>
      <div className="text-center mt-4 text-sm text-gray-500">
        <p>Login padrão:</p>
        <p>Usuário: <strong>admin</strong> | Senha: <strong>123</strong></p>
      </div>
    </div>
  );
};

export default Login;