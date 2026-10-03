# Templates de e-mail do LynkoMarketplace

Os arquivos `confirmation.html`, `recovery.html`, `magic-link.html`, `invite.html` e `email-change.html` são, respectivamente, os templates de confirmação de cadastro, recuperação de senha, link de acesso, convite e troca de e-mail do Supabase Auth. Eles usam as variáveis nativas `{{ .SiteURL }}`, `{{ .ConfirmationURL }}` e `{{ .NewEmail }}`.

No Supabase Dashboard, acesse **Authentication → Email Templates → Confirm signup**, cole o conteúdo de `confirmation.html` e salve. Para recuperação, acesse **Authentication → Email Templates → Reset Password**, cole o conteúdo de `recovery.html` e salve. Para o link de acesso, acesse **Authentication → Email Templates → Magic Link**, cole o conteúdo de `magic-link.html` e salve. Para convites, acesse **Authentication → Email Templates → Invite user**, cole o conteúdo de `invite.html` e salve. Para troca de e-mail, acesse **Authentication → Email Templates → Change Email Address**, cole o conteúdo de `email-change.html` e salve. Os templates também podem ser usados por automação de deploy que sincronize arquivos de `supabase/templates`.

O HTML usa apenas estilos inline e tabelas, para funcionar melhor em Gmail, Outlook e clientes de e-mail móveis. A imagem do logotipo aponta para o mesmo endereço já utilizado no cabeçalho do site.
