import { typematchups } from './typematchups';
import * as Colors from './colors';
import * as Language from './language';

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export { typematchups, Colors, Language, capitalize };
