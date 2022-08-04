import { camelize } from 'src/shared/utils';
import { pick } from 'lodash';

export function preprocessAsset(assetResponse: any, address: string) {
  const camelized = pick(camelize(assetResponse), [
    'id',
    'tokenId',
    'imageUrl',
    'imagePreviewUrl',
    'imageThumbnailUrl',
    'imageOriginalUrl',
    'name',
    'description',
    'externalLink',
    'permalink',
    'owner',
    'orders',
    'auctions',
    'supportsWyvern',
    'traits',
  ]);

  const imageFields = [
    'imageUrl',
    'imagePreviewUrl',
    'imageThumbnailUrl',
    'imageOriginalUrl',
  ];

  imageFields.forEach((field) => {
    if (camelized[field] === '') {
      camelized[field] = 'https://doko.one/DOKO_LOGO.png';
    }
  });

  const {
    id,
    tokenId,
    imageUrl,
    imagePreviewUrl,
    imageThumbnailUrl,
    imageOriginalUrl,
    name,
    description,
    externalLink,
    permalink,
    supportsWyvern,
  } = camelized;

  const ownerFields = ['user', 'profileImgUrl', 'address'];
  const traitFields = ['traitType', 'value', 'traitCount'];
  const auctionFields = [
    'auctionContractAddress',
    'currentPrice',
    'startedAt',
    'duration',
    'startingPrice',
    'endingPrice',
  ];
  const tokenFields = ['symbol', 'address', 'ethPrice', 'usdPrice', 'decimals'];
  const orderFields = [
    'closingExtendable',
    'createdDate',
    'closingDate',
    'currentPrice',
    'orderHash',
    'exchange',
    'maker',
    'taker',
    'side',
  ];

  const owner = pick(camelized.owner, ownerFields);

  const traits = (camelized.traits || []).map((trait) =>
    pick(trait, traitFields),
  );

  const auctions = (camelized.auctions || []).map((auction) => {
    const picked = pick(auction, auctionFields);
    picked.paymentToken = pick(auction.paymentToken, tokenFields);
    return picked;
  });

  const orders = (camelized.orders || []).map((order) => {
    const picked = pick(order, orderFields);
    picked.paymentToken = pick(order.paymentTokenContract, tokenFields);
    return picked;
  });

  const sellOrders = orders.filter((order) => order.side === 1);

  const buyOrders = orders.filter((order) => order.side === 0);

  // non-null taker address is a private sale
  const minSellOrderPrice = Math.min(
    ...sellOrders
      .filter(
        (order) =>
          order.taker.address ===
            '0x0000000000000000000000000000000000000000' &&
          !!order.closingExtendable === false,
      )
      .map(
        (order) =>
          (parseFloat(order.currentPrice) / 10 ** order.paymentToken.decimals) *
          parseFloat(order.paymentToken.usdPrice),
      ),
  );
  const minAuctionPrice = Math.min(
    ...auctions.map(
      (auction) =>
        (parseFloat(auction.currentPrice) /
          10 ** auction.paymentToken.decimals) *
        parseFloat(auction.paymentToken.usdPrice),
    ),
  );

  const minPrice = Math.min(minSellOrderPrice, minAuctionPrice);

  const asset = {
    id,
    address,
    tokenId,
    imageUrl,
    imagePreviewUrl,
    imageThumbnailUrl,
    imageOriginalUrl,
    name,
    description,
    externalLink,
    permalink,
    owner,
    sellOrders,
    buyOrders,
    auctions,
    supportsWyvern,
    traits,
    price: minPrice === Infinity ? null : minPrice,
  };

  return asset;
}
