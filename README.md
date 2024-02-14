# Todo scrap Pathé

## Steps
- Get list theater of Paris (GET https://www.pathe.fr/api/cities?language=fr)
- Get list shows for each theater (GET https://www.pathe.fr/api/cinema/[slug-name-cinema]/shows?language=fr)
- Filter results of shows with flag "Avant-Première" | "Avant premiere + équipe" + isEarlyAVP

