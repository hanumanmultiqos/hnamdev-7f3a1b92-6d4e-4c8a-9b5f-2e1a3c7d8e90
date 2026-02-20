export class CommonConstants {
  public static readonly PHONE_REGEX =
    /^(\s?[0-9]{2}\s?)([0-9]{3}\s?[0-9]{3}|[0-9]{2}\s?[0-9]{2}\s?[0-9]{2})$/; // NOSONAR
  public static readonly EMAIL_REGEX = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/; // NOSONAR
  public static readonly NUMBER_ALLOWED_REGEX = /^[0-9]*\.?[0-9]*$/; // NOSONAR

  public static readonly encryptSecretKey =
    '9b05f590eca53ffdbb2d16e3bcd1f015b06860420cded62768383f343c1a9445';

  public static readonly TOKEN = '_AT';
  public static readonly ACCESS_TOKEN = '_ACT';
  public static readonly CLIENT = '_CLNT';
  public static readonly EXPIRY = '_EXP';
  public static readonly UID = '_UID';

  public static readonly USER_DATA = '_UT';
  public static readonly PER_PAGE = '_PP';
  public static readonly CURRENT_PAGE = '_CP';
  public static readonly PAGE_NAME = '_PN';
  public static readonly LENGTH = '_L';
  public static readonly SORT_KEY = '_SK';
  public static readonly IS_SEARCH = '_IS';
  public static readonly IS_BACK = '_IB';
  public static readonly USER_STATUS = '_US';
  public static readonly FORGOT_EMAIL = '_FE';
  public static readonly OTP_TIMER = '_OT';
  public static readonly OTP_SENT = '_OS';
  public static readonly QUERY = '_QR';
  public static readonly OTP_VALUE = '_OV';

  public static readonly REMEMBER_ME = '_RM';
}
