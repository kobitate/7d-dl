# 7d-dl

Automatic downloader for 7Digital

## Usage

1. Clone or download this repo
2. Enter the terminal of your choice and navigate to the repo
3. Run `npm install` or `yarn install` to download the required packages
4. Copy `.env.example` to `.env` and edit the values (see below)
5. Run `node ./index.js` to download releases.

### Environment Variables

| Variable Name   | Description | Example |
|:----------------|-------------|---------|
| `BASE_URL`        | **Required** - 7Digital region domain associated with your account | `https://us.7digital.com` |
| `SESSION`         | **Required** - Session value from 7Digital cookie, see "7Digital Cookie" below | |
| `SECURE_SESSION`  | **Required** - SecureSession value from 7Digital cookie, see "7Digital Cookie" below | |
| `MUSIC_DIR`       | Directory where music will be downloaded to, defaults to `downloads` inside repo directory | `/mnt/music` |
| `PLEX_URL`        | Plex Server URL, skips library scanning if not supplied | `http://plex.local:32400` |
| `PLEX_TOKEN`      | [Plex authentication token](https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/), required only if a `PLEX_URL` is supplied | |
| `PLEX_LIBRARY_ID` | Numeric ID of your Plex music library, required only if a `PLEX_URL` is supplied. See ["Listing Defined Libraries" on this page](https://support.plex.tv/articles/201638786-plex-media-server-url-commands/) | `2` |

### 7Digital Cookie

1. Install a cookie manager for your browser. I used the [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg) Chrome extension. You can also use the browser console to retrieve these values.
2. Find the cookies titled `session` and `secureSession`, and copy them to your `.env` file

![7Digital Cookie](https://i.imgur.com/pddiuLy.png)

## Notice

This is an *unofficial product* simulating a user downloading releases directly from their 7Digital account. I am **not affiliated with 7Digital**. 

Note that 7Digital does impose an un-published download limit per release. I recommend only downloading a release once. 7d-dl keeps a local cache of what has already been downloaded to try and avoid any issues associated with downloading a release too many times. When migrating to a new machine, I recommend copying `cache.json` to ensure your already-downloaded releases are not downloaded again.

I am not responsible for any repercussions (if any) from using this code.
