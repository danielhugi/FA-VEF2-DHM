import { style } from "@vanilla-extract/css";

export const ownerContainer = style({
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    alignItems: 'center',
    padding: 20,
})

export const ownerAvatar = style({
    width: 150,
    height: 150,
    borderRadius: '50%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
})