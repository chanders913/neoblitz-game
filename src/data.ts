import { Skin, ChatMessage, Friend, VaultLevel, PlayerStats } from './types';

export const INITIAL_PLAYER_STATS: PlayerStats = {
  volt: 1250,
  gems: 50,
  name: 'CypherPunk_99',
  rank: 42,
  level: 12,
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvTQdq8gubddxZQHJ9vYGObtZLqfrWMLnoRjRaAfDImMUj3EYAt0vowXijArlEaee4JonFILtyf3Ak9pXk1YkhEX0eiG33JDKy2Jk1KRd2Jm2qJ-uhmbNDUAcPRJbCvdlKgIL998joZEFGDxgy5Dj87tj-wOj2f9n0MqEGpd9pzpFOnOnqSG9NHrgxTUQRndV2dqGd6JPKhKbVhB-ljeA8rP6Iqnpqp-g91Umywoj5hpXhTFePkBpJOiU1TV1FmegO3xQ4hwnNRSE',
  equippedSkinId: 'neon-strike',
  dailyProgress: 1, // 1 of 3 matches won
  wins: 1402,
  totalKos: 8931,
  topSpeed: 240,
  distance: 42000,
};

export const SKINS_CATALOG: Skin[] = [
  {
    id: 'neon-strike',
    name: 'Neon Strike',
    rarity: 'Epic',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQXUCGGGJ5LOSvaBn0MgNUGBW4AV27Ao8Sx4EmgQfCS42M7e6xKZd4cBH6ojiewvC1VosXrCRsMmelUO0ANfTsuWH2Y8NzsuzrOkt918QQqUFCSSF061JJ9bcKZTagkxhsLjwF6uFYJ7-xOUaldN2Qokx7RX1GUXqD-_Xy4oQbZO7Shj6MKWmpaOsuLAedjFL6LiLbRrurhCgLM9NZvBsZpYXJZDe5xjafd4FPvamXPGd223DfvNQLePOI0EWHcMK5E32g1k69ilA',
    orbImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD73_hj91H2PfQDKcxKdUzTVvdGcB9BHCfLQVNM4qn5iCtQshAUMNvAJ16UqBMnYgIHJL1B-jeo7Ruz5UDz699VtoH0ZhBOXjDdoToc8VHNJMfpwoBKZSi-V9tWfW3bJl17vxdsj5vKSLH1IfT-oxngJ2kRZa63jeSVdu46m41F8yrkaeYsHrFGevSksj4uc2Yz6qIkGqc5gJmHBoQRxSOTdINtn0szePcT8ybK_HySH9Oo2glIR3ymNqdjmCWBCWrOsVT2HDJWpAI',
    characterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIt3EgQj7nXdzXN3O9cmxIoeI7wsrj6vq-rX6-R3cgwSkGfZUa2IE8ofS1vrq_rV9uraanI235zzQzR-R-OT9sii8jcJnTkD9LqCn14WE1AUeRj6ni0nEhE3_5_WXxX2CJjUQk0jStjl8_K_S4utLFiRo9nXotwcKbjEYwS9AsOiwVzwex1yvReJPN3WScNxnqUIaYH5zxucHy9KJ12DpvZb_8bxe-d2VjVvod0FXjT7ObHF2gZtwzkiI-qrQiXOCFzmZhNoj1aic',
    owned: true,
  },
  {
    id: 'crimson-void',
    name: 'Crimson Void',
    rarity: 'Rare',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuEfUfHojC7BlBljlbaYB9DvySbeEDGpV7HAuoF0ixzFqQBRBAEIpMiLoX4hxJOyKpqdfDGfZ5_PZTpySJRW4FWoci9Ab5WqSBbNhAxuA1JPN6nQQDW-OsWiZTcXJgQE2J1V6pPw7v5lhqgoSjmlr-UnPAZDuZ2r1YMCM1l4SqcOlOw1UFHNEDGOUzsN7CjubXIvEd9PqL5shXVdsZ9UHjpMtqW8XjtKGBAo7I6BIsa0PaY-vH7IvOWw4QJC64QMwXpyeVxlzxuG0',
    orbImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD73_hj91H2PfQDKcxKdUzTVvdGcB9BHCfLQVNM4qn5iCtQshAUMNvAJ16UqBMnYgIHJL1B-jeo7Ruz5UDz699VtoH0ZhBOXjDdoToc8VHNJMfpwoBKZSi-V9tWfW3bJl17vxdsj5vKSLH1IfT-oxngJ2kRZa63jeSVdu46m41F8yrkaeYsHrFGevSksj4uc2Yz6qIkGqc5gJmHBoQRxSOTdINtn0szePcT8ybK_HySH9Oo2glIR3ymNqdjmCWBCWrOsVT2HDJWpAI', // base orb
    characterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU8KoUl9O7PJq-UcvhJsXwe_QVUMOn-tzARcESFBzsBW0HczLPRVNshDJlkzuakPLORnp4Vpa4XUgtG5JBnQNjbYZ2YEgwmq4fkQ5HE-9artGFgx-JnCZfTcIn_6JXgo5aGZLByn1QwGotX_YdORjxgm6gFVUF3mAhjDBV2-Cy5bWZPjS0qvukZ7RtAQwnpQKP_UI1SJyBhdnTmwq0om7i7qu9VlGH7h-W9Y_geWwRbJABWOlEdBXnysA4vQQIHJCEcHG6zE6H2NM',
    owned: true,
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    rarity: 'Legendary',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzzpTbuHlwR_8Rhqhw1aUOh67dapZsC-GRDlJlfKJZq8t1bnMNRZGRZAAAcn1fpaiAoyneydAhGaNh-kaz3AYfoMZVLZEsu4Blzda0vpAXc1orpx5LrvsliPzA87ynlw9nhijyQxVr3OnpZZwxszWeGe19YSrSvUoCGD7vB-CkVTvC183PutWU6eXEGL9eP9A022KMfqboUyVp2xbXtY6y3-7yqTJkZhqp6p3uO2IPE-cHxHeIPQNZbDBMS_wAXOGkY2FFPgdGy54',
    orbImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD73_hj91H2PfQDKcxKdUzTVvdGcB9BHCfLQVNM4qn5iCtQshAUMNvAJ16UqBMnYgIHJL1B-jeo7Ruz5UDz699VtoH0ZhBOXjDdoToc8VHNJMfpwoBKZSi-V9tWfW3bJl17vxdsj5vKSLH1IfT-oxngJ2kRZa63jeSVdu46m41F8yrkaeYsHrFGevSksj4uc2Yz6qIkGqc5gJmHBoQRxSOTdINtn0szePcT8ybK_HySH9Oo2glIR3ymNqdjmCWBCWrOsVT2HDJWpAI',
    characterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIt3EgQj7nXdzXN3O9cmxIoeI7wsrj6vq-rX6-R3cgwSkGfZUa2IE8ofS1vrq_rV9uraanI235zzQzR-R-OT9sii8jcJnTkD9LqCn14WE1AUeRj6ni0nEhE3_5_WXxX2CJjUQk0jStjl8_K_S4utLFiRo9nXotwcKbjEYwS9AsOiwVzwex1yvReJPN3WScNxnqUIaYH5zxucHy9KJ12DpvZb_8bxe-d2VjVvod0FXjT7ObHF2gZtwzkiI-qrQiXOCFzmZhNoj1aic',
    owned: false,
    costVolt: 4000,
    costGems: 200,
  },
  {
    id: 'deep-sector',
    name: 'Deep Sector',
    rarity: 'Common',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqUKPk4MIRUb_mAmQkCy7qvDeXuPAH1O5jCv_GFH0WBoWzW-HogDoX-yleRSXuxorG2jj8wo2lk0ptiO0QIIecdtp-2gN4DlKQnNXz6GoDoVclux-jHIE3xQ52EtyE-xqlQV0LWS5peBYO9MSQHoLdRZqtNqenSXN-w001nSVwzm0eJAtzv6rHNgbjM4MLkJZzwmVePwjFCHtCiSq_slKelc-gPvskV7reKRxLzsoUafqbtIf8GpPuNtONDwfKMvMTx3ia6T7aDpc',
    orbImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD73_hj91H2PfQDKcxKdUzTVvdGcB9BHCfLQVNM4qn5iCtQshAUMNvAJ16UqBMnYgIHJL1B-jeo7Ruz5UDz699VtoH0ZhBOXjDdoToc8VHNJMfpwoBKZSi-V9tWfW3bJl17vxdsj5vKSLH1IfT-oxngJ2kRZa63jeSVdu46m41F8yrkaeYsHrFGevSksj4uc2Yz6qIkGqc5gJmHBoQRxSOTdINtn0szePcT8ybK_HySH9Oo2glIR3ymNqdjmCWBCWrOsVT2HDJWpAI',
    characterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU8KoUl9O7PJq-UcvhJsXwe_QVUMOn-tzARcESFBzsBW0HczLPRVNshDJlkzuakPLORnp4Vpa4XUgtG5JBnQNjbYZ2YEgwmq4fkQ5HE-9artGFgx-JnCZfTcIn_6JXgo5aGZLByn1QwGotX_YdORjxgm6gFVUF3mAhjDBV2-Cy5bWZPjS0qvukZ7RtAQwnpQKP_UI1SJyBhdnTmwq0om7i7qu9VlGH7h-W9Y_geWwRbJABWOlEdBXnysA4vQQIHJCEcHG6zE6H2NM',
    owned: false,
    costVolt: 1000,
    costGems: 40,
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    username: 'VoidWalker',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5sKNscOOtxvYsujRm97_Axox_lo0QmJRU8SOQ6648zuMStLmQOAOR5FfHiulWQzeM6_IT4dM8Q1wx5s-3zgHc8gq0rUIGl81N8ORPkULoAOOQj9dk0eOL9vxohat21KNHJ3gPr-sOO48bJ0n4WI9lAgG8k16XGn5m-DrQv5aNYo5NRCVvgEsvUmRzAMgdeTiSUB9UC3qVEyBYD2XRw1wq08kMTs2b9mMughZkm6gjerDMCbPCdBzPwvmQWrUhzCL1HagZ20XAdqY',
    time: '12:42',
    text: 'Anyone running ranked? Need a solid support.',
    isMe: false,
  },
  {
    id: 'msg-2',
    username: 'You',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvTQdq8gubddxZQHJ9vYGObtZLqfrWMLnoRjRaAfDImMUj3EYAt0vowXijArlEaee4JonFILtyf3Ak9pXk1YkhEX0eiG33JDKy2Jk1KRd2Jm2qJ-uhmbNDUAcPRJbCvdlKgIL998joZEFGDxgy5Dj87tj-wOj2f9n0MqEGpd9pzpFOnOnqSG9NHrgxTUQRndV2dqGd6JPKhKbVhB-ljeA8rP6Iqnpqp-g91Umywoj5hpXhTFePkBpJOiU1TV1FmegO3xQ4hwnNRSE',
    time: '12:43',
    text: "I'm down. Give me 5 mins to finish this loadout.",
    isMe: true,
  },
  {
    id: 'msg-3',
    username: 'Kryo_Gen',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyVoPRqE0Av7_0nw_pkNC-oWOz6HPIqNzGOS1bg_A1tB4Qv3fAE-ss67kMH2xjGpM0ihTA08gKG6K_YG7qcSVFdA8pF9DE5rjV7U-s5pwZBUVyCVjbSQu_7nIV578b7pH_vTDaFpLw1fpy8HnwFE99swH3qrYc4jLaF0nT0uDW2QUcNvPDfB6pHV14ybw9PvkOtUixUH780dJd-KcX3tmCapR_yGuz10Jmeijf0emNuXxMCD567kY176iURdwVS-v57h_WBvhwVkI',
    time: '12:44',
    text: 'Room for one more? I need that daily bonus.',
    isMe: false,
  },
];

export const SQUAD_FRIENDS: Friend[] = [
  {
    username: 'NovaFlare',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfncmn3uVGQet1wKi1SmPzCtpAOTsGVWoZfGOrivbgEs6A6-dNjfptjs4vv01mmhIYGyCwODTmdmB0_JirTGxSl0ObnBxnphssFCXrvmt5zwPLXIo8xxryGp49I4Z9_DCEE0TsPIFEtLaR_6cweaXMrKgViF3cvKUJhFymqfg5Mo1hcZWIQjCjQ2Ef-CHx6xqqu7-K4xzJVNNJBGQoaiROJubm5ba126DuRmowmYMCGk-ytiLYWTRzsWfcvjXxShnEQ6TgtNFZLZg',
    status: 'IN ARENA',
    statusDetail: 'RANKED',
    online: true,
  },
  {
    username: 'Kryo_Gen',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyVoPRqE0Av7_0nw_pkNC-oWOz6HPIqNzGOS1bg_A1tB4Qv3fAE-ss67kMH2xjGpM0ihTA08gKG6K_YG7qcSVFdA8pF9DE5rjV7U-s5pwZBUVyCVjbSQu_7nIV578b7pH_vTDaFpLw1fpy8HnwFE99swH3qrYc4jLaF0nT0uDW2QUcNvPDfB6pHV14ybw9PvkOtUixUH780dJd-KcX3tmCapR_yGuz10Jmeijf0emNuXxMCD567kY176iURdwVS-v57h_WBvhwVkI',
    status: 'IN LOBBY',
    online: true,
  },
  {
    username: 'IronHide',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiX2Q9wOIF-sJ9ZkLuNrK5gSXDl2BaZj2SYVx3X1xApCuGlA-6p0dAr4qJgZjJeDwQn8Wrc_mWfDQwODhBNtQJpGJbfAzNozGdy2hKMNEqjQibnDnpuUGzKZheJlCJHMjVgt683kQZmiGNF-fg9ImF-ZFq7oC5_UxKIOMYjQ12o_5GWTZBk114fRddjMfiiIGO0x0WzVP9Dv2nd4E0uc4JrpNj3WdFRPD4lINv9hFE6cBwRpsy7U9EpEiLhaFIgUhvM9sXDVkE_0Q',
    status: 'IN LOBBY',
    online: true,
  },
  {
    username: 'VoidWalker',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5sKNscOOtxvYsujRm97_Axox_lo0QmJRU8SOQ6648zuMStLmQOAOR5FfHiulWQzeM6_IT4dM8Q1wx5s-3zgHc8gq0rUIGl81N8ORPkULoAOOQj9dk0eOL9vxohat21KNHJ3gPr-sOO48bJ0n4WI9lAgG8k16XGn5m-DrQv5aNYo5NRCVvgEsvUmRzAMgdeTiSUB9UC3qVEyBYD2XRw1wq08kMTs2b9mMughZkm6gjerDMCbPCdBzPwvmQWrUhzCL1HagZ20XAdqY',
    status: 'OFFLINE',
    statusDetail: 'Last seen 2h ago',
    online: false,
  },
];

export const LEADERBOARD_PODIUM = [
  {
    rank: 1,
    name: 'ApexPredator',
    score: '15,800 VOLT',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLbVRlu2oI9u2zE_Bv64EEx6_2jTYVjhhTlMR3-AO_aet9HfVUMaz2zDaOsMI-5V4SQNrPhQqouXto9kb30XvmqVwtZuBoRXe0f_H9eFbkWPJ9rHWCgk8-jNdbF0r3gHPJWs8P-wBeTnJn-2dH1inrvHuiUUVvG_FfLLL65_sYjRU-jlT2QmuLTvXLEtuyqKhRtdRzWxHOJzgYdQ0zhAQGysQdTI4zN5DECbiqA4mbYFBm3eahVBmE5eOcAxSBHkZ_BaWNuK5QR6U',
    isChamp: true,
  },
  {
    rank: 2,
    name: 'NeonRider99',
    score: '14,250 VOLT',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADKo5MQX-aPgidU1AFbVtER7mb7wYl-ekX1eNZ88VfInWlmk7cG1He3PPnARWJxzNF7g4YivYy8QusAXIAIIdUwYb6u93G9TLhlnV4rv2N3Wxieg4a0cYhNcfGt2GdQrAqn5B1Sgx22fqUIcnM1tebgGx2WtEix2fT344yHF60ykxzYVLGtH14sTaoVnkW1TB1o8Ut7IArcExvURXhT9yzcG9Rfx1L4OPRPZMLMWMdDhdEcqVZLF0oSfWQPCMw-U7EZanvZXZzoz8',
  },
  {
    rank: 3,
    name: 'CyberNinja',
    score: '13,900 VOLT',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxThVkL5GEVhn1Ih1Bpd_YWoWYFWHgvi3IP4bwNrwXiBirKK3WuatGBBafra9CqSXI9tRY0VUctV7uHtDIILfsBqBNVYdPxv_-8Hehe_M0N1vkmc6uTODy9_0s36Pr03iB9HjKtLwwN_GUDr_tSVvZHSgMH1jcxK0Dp8QFrHD7e7n2Z_WP-im8Coqb4sR9Nm6UDGW6OssaRZRKeOF_JQDqnsVZ-m61Hvud948ifOs5FYnIREqFNNyAlaIkzVyfOS7iEcvGFLfzszM',
  },
];

export const LEADERBOARD_LIST = [
  {
    rank: 4,
    name: 'VortexStrike',
    score: '13,100',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmSgm0WA0-hnyQzWrljwZ93ATKPrwQ8tmut8tG8bz2GzmT3-3uoNQ8ZSXvElxHbLylqr4-ou9CIXKlP18GX3cz-06S1mGswETy7Lt6liQYau173p6rHAUFrPnBX6XyPtaziDuxI7faoKI5sn5tTbFduGw1Wq4bXicqRTjxa-_uvqr4zZBgHZTI-1GVJ4nSg_Q8elL7KM7LTN7hziIKUZAHLcuEXa6Zrj4R1JAHZU7FcCp1PVLiXen7mtd1FlXkkyeGDSORVgm5NBo',
  },
  {
    rank: 5,
    name: 'GlitchKing',
    score: '12,850',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2fRziWH9EJIG4XdW6r_YkomhMLR7TGv8AP7Bubu6HBkqhHL4R9f2jxk6erA3e282LnGfvyosPUZuaSHiViWMisVZQb82l_kdIYA4IGzWlpaql1G1REdJ4HlU-knG2RpRz900NvPv8M6wIkwtV4PhW8NROKM2dB4JKT_vM4dJ8pyRNWn5SZpFlSa18nTy8jNHXkn628M1sc-YtmCZXEWzI7MXEv13UP4EX7EYyzaS_Z0dFYM8Q0bMTmty-FE7UYzra6A0av0GJWEw',
  },
  {
    rank: 6,
    name: 'ByteSlasher',
    score: '12,400',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADKo5MQX-aPgidU1AFbVtER7mb7wYl-ekX1eNZ88VfInWlmk7cG1He3PPnARWJxzNF7g4YivYy8QusAXIAIIdUwYb6u93G9TLhlnV4rv2N3Wxieg4a0cYhNcfGt2GdQrAqn5B1Sgx22fqUIcnM1tebgGx2WtEix2fT344yHF60ykxzYVLGtH14sTaoVnkW1TB1o8Ut7IArcExvURXhT9yzcG9Rfx1L4OPRPZMLMWMdDhdEcqVZLF0oSfWQPCMw-U7EZanvZXZzoz8',
  },
  {
    rank: 7,
    name: 'AeroStrike',
    score: '11,920',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQXUCGGGJ5LOSvaBn0MgNUGBW4AV27Ao8Sx4EmgQfCS42M7e6xKZd4cBH6ojiewvC1VosXrCRsMmelUO0ANfTsuWH2Y8NzsuzrOkt918QQqUFCSSF061JJ9bcKZTagkxhsLjwF6uFYJ7-xOUaldN2Qokx7RX1GUXqD-_Xy4oQbZO7Shj6MKWmpaOsuLAedjFL6LiLbRrurhCgLM9NZvBsZpYXJZDe5xjafd4FPvamXPGd223DfvNQLePOI0EWHcMK5E32g1k69ilA',
  },
];

export const VAULT_TRACK: VaultLevel[] = [
  {
    level: 7,
    freeReward: {
      type: 'Volt',
      name: '100 VOLT',
      amount: 100,
    },
    eliteReward: {
      type: 'Gear',
      name: 'SHIELD',
    },
  },
  {
    level: 8,
    freeReward: {
      type: 'Skin',
      name: 'NEON SIDEARM',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHYlkyoQZONAq2xz22hoF9d63LeYp86YptOtFZhH7GfkNvZDhqiiZ6eY_XZ8wMhmCLrTf4vDUgLeVuCEsssL_extNjDVA6vvNOg06jrcf5yekF69QduCeFwA-fey9ZvSaviD9yzz7ZIzipRYfpyj8uDjaBowB9FplSMNMJUv38YCcW8Ifg4iPTujNByy5-V-Jtjd4Ph5aFf7DL8n5A_x7KB4VFlWqDrp7sRv5DcrGNf6vbxog9niqvaKq5vWtuvJzGhypgd3Xw4_8',
    },
    eliteReward: {
      type: 'Gems',
      name: '50 GEMS',
      amount: 50,
    },
  },
  {
    level: 9,
    freeReward: {
      type: 'Gear',
      name: 'GEAR DROP',
    },
    eliteReward: {
      type: 'Skin',
      name: 'VOID VISOR',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxK3HGuISSOkM48sfj0S01SufNiQ-9bg76zOHp9cLOF3tIjE-2bDHjPXKsDJk4P5U53vsLox-3so8nW-tivM-yVfJp2pr51pA71SHInibeZDjUnLzLtYFQ3B0_axtLh4sc8x6dXS7fbuHTWsFRZBdzajAzQXe-jwyTxHQPrxFHDXerQFYuOtYFGC3IgAnFk-h8XiCIeHTXUxy22vSAfNGoGvnjeyuGcszm0iUUPnijVDvrjZmY4d-AvWp9H8YJ5DQ8eYItsF_hPfU',
    },
  },
  {
    level: 10,
    freeReward: {
      type: 'Core',
      name: 'CORE CHIP',
    },
    eliteReward: {
      type: 'Gear',
      name: 'EMBLEM',
    },
    milestone: true,
  },
];
