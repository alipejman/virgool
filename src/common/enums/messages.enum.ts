export enum AuthMessage {
    NotFoundAccount = 'حساب کاربری یافت نشد',
    InValidType = 'نوع ورودی نامعتبر است',
    ExistAccount = 'حساب کاربری وجود دارد',
    ExpiredCode = 'کد منقضی شده است',
    InvaloToken = 'دوباره وارد شوید',
    NotLoginPleaseLogin = 'لطفا وارد شوید',
    SignIn = 'ورود با موفقیت انجام شد',
}

export enum BadRequestExeption {
    Phone= 'شماره موبایل نامعتبر است',
    Email = 'ایمیل نامعتبر است',
    Username = 'نام کاربری نامعتبر است',
    InvalidTypePhoto = 'فرمت تصویر مورد نظر قابل قبول نیست',
}

export enum CategoryMessage {
    created= "دسته بندی با موفقیت ایجاد شد",
    exist= "دسته بندی وجود دارد",
    notFound= "دسته بندی یافت نشد",
    updated= 'دسته بندی با موفقیت ویرایش شد',
    deleted= 'دسته بندی با موفقیت حذف شد',
    isnottrue= "دسته بندی را به درستی وارد کنید"
}

export enum User {
    UpdatedProfile= "پروفایل شما با موفقیت بروز شد",
    ExistEmail= "این ایمیل قبلا ثبت شده است!",
    ExistPhone= "موبایل مورد نظر موجود میباشد",
    ExistUsername= "نام کاربری قبلا شده",
    NotFoundUser= "کاربری پیدا نشد",
    Followed = "با موفقیت دنبال شد",
    UnFollow = "از لیست دنبال شوندگان حذف شد",
    Blocked = "حساب کاربری با موفقیت مسدود شد",
    UnBlocked = "حساب کاربری از حالت مسدود خارج شد",
}

export enum publicMessage {
    sendOtp= "کد با موفقیت ارسال شد ",
    somthinWrong= "خطایی پیش آمده مجددا تلاش کنید",
    created= "با موفقیت ایجاد شد..",
    remove= "حذف شد"
}

export enum BlogMessage {
    created= "مفاله با موفقیت ایجاد شد",
    updated= "مفاله بروز رسانی شد",
    delete = " مفاله حذف شد",
    notFound= "مقاله پیدا نشد",
    liked= "مقاله با موفقیت لایک شد",
    notLike= "لایک شما حذف شد",
    bookmark= "مقاله ذخیره شد",
    notBookmark= "مقاله از ذخیره ها خارج شد",
    commentCreate = "نطر شما با موفقیت ثبت شد",
    acceptedComment= "نظر با موفقیت تایید شد",
    acceptedAlready= "این نظر از قبل تایید شده بود",
    rejectedComment= "نظر با موفقیت رد شد",
    rejectedAlready = "نظر از قبل رد شده بود",
    NotFound = "مقاله پیدا نشد"
    
}