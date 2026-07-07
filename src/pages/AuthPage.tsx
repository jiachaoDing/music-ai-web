export function AuthPage() {
  return (
    <section className="auth-page">
      <div className="page-heading">
        <span>Echo AI</span>
        <h1>登录 / 注册</h1>
        <p>未登录用户只进入认证页，登录后进入音乐社区主流程。</p>
      </div>
      <form className="panel-form">
        <label>
          昵称或账号
          <input placeholder="请输入昵称或账号" />
        </label>
        <label>
          密码
          <input placeholder="请输入密码" type="password" />
        </label>
        <label>
          邀请码
          <input placeholder="注册时填写邀请码" />
        </label>
        <button type="button">进入 Echo</button>
      </form>
    </section>
  )
}
