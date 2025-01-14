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
}

export enum User {
    UpdatedProfile= "پروفایل شما با موفقیت بروز شد",
    ExistEmail= "این ایمیل قبلا ثبت شده است!",
    ExistPhone= "موبایل مورد نظر موجود میباشد",
    ExistUsername= "نام کاربری قبلا شده"
}

export enum publicMessage {
    sendOtp= "کد با موفقیت ارسال شد ",
    somthinWrong= "خطایی پیش آمده مجددا تلاش کنید"
}