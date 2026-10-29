import {speechManifest} from '../../lib/template/speech';
export const GET=()=>Response.json(speechManifest(true));
