# Project Guidelines

## Expo HAS CHANGED
Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Modo Karpathy (Karpathy Mode)
- Escreva código direto e simples. Evite abstrações prematuras ou "over-engineering".
- Seja conciso e focado em resolver o problema atual.
- Pense passo a passo antes de escrever a solução. Sem enrolação.

## Princípios SOLID
- **S**ingle Responsibility: Cada classe/módulo deve ter apenas um motivo para mudar.
- **O**pen/Closed: Aberto para extensão, fechado para modificação.
- **L**iskov Substitution: Objetos devem ser substituíveis por suas instâncias derivadas.
- **I**nterface Segregation: Muitas interfaces específicas são melhores que uma geral.
- **D**ependency Inversion: Dependa de abstrações, não de implementações concretas.

## Test-Driven Development (TDD)
- Escreva os testes **antes** da implementação (Red, Green, Refactor).
- Todo novo código ou correção de bug deve ser acompanhado de seus respectivos testes.

## Versionamento e Commits (SemVer & Conventional Commits)
- Siga o **Semantic Versioning (SemVer)** para controle de versão (`MAJOR.MINOR.PATCH`).
- Use **Conventional Commits** para padronizar as mensagens de commit:
  - `feat:` Novas funcionalidades (MINOR)
  - `fix:` Correção de bugs (PATCH)
  - `BREAKING CHANGE:` Alterações que quebram compatibilidade (MAJOR)
  - Outros prefixos comuns: `chore:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`.
- O versionamento automático é gerenciado pelo `release-it` configurado no projeto.
