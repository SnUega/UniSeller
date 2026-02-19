# Решение Git конфликта

Проблема: На GitHub есть изменения, которых нет локально.

## Решение 1: Pull с rebase (рекомендую)

```bash
# Сохрани текущие изменения
git add .
git commit -m "Local fixes applied"

# Получи изменения с GitHub
git pull --rebase origin main

# Если есть конфликты, разреши их вручную, затем:
git rebase --continue

# Отправь обновления
git push origin main
```

## Решение 2: Pull с merge (проще)

```bash
# Сохрани текущие изменения
git add .
git commit -m "Local fixes applied"

# Получи и объедини изменения
git pull origin main

# Разреши конфликты если есть

# Отправь обновления
git push origin main
```

## Решение 3: Force push (ОПАСНО - только если уверен!)

```bash
# ⚠️ ЭТО УДАЛИТ ВСЕ ИЗМЕНЕНИЯ НА GITHUB!
git push origin main --force
```

## Что делать дальше:

1. Выбери Решение 1 или 2
2. После успешного push:
   ```bash
   npm run build
   # GitHub Actions задеплоит автоматически
   ```
