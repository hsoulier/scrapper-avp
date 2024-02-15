# Todo scrap Pathé

## Steps

- Get list theater of Paris (GET https://www.pathe.fr/api/cities?language=fr)
- Get list shows for each theater (GET https://www.pathe.fr/api/cinema/[cinema-slug]/shows?language=fr)
- Filter results of shows with flag "Avant-Première" | "Avant premiere + équipe" + isEarlyAVP
- Get details of show (GET https://www.pathe.fr/api/show/[film-name-with-id]/showtimes/[cinema-slug]/[date (ex:2024-02-27)]?language=fr
  )

## Schema of data

- name (string)
- showId (string)
- movieId (string)
- cinemaName (string)
- dateShow (string -> converted from date) -> date + hour
- version (string-> VO | VOSTF | VF)
- earlyType (AVP | AVPE)
- linkMovie (string)
- linkShow (string)
- genre ?(string[])
- duration ?(string)
- source (string -> where come from the data)

## TODO

- Cli to get data
  - Choose the provider to scrap data
