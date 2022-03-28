import React from 'react';
import { useTranslation } from 'react-i18next';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
    text: {
        textAlign: 'right',
    },
    ul: {
        direction: 'rtl',
        paddingRight: 16
    },
    right: {
        alignItems: 'right'
    },
    closeButton: {

    }
}))

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6" className={classes.text}>{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});
const PrivayPolicyDailog = ({ open, handleClose }) => {
    const { t } = useTranslation()
    const classes = useStyles()
    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                {t('copyright.privacyPolicy')}
            </DialogTitle>
            <DialogContent dividers className={classes.text}>
                <b>ملخص</b>
                <Typography gutterBottom>
                    سياسة الخصوصية الخاصة بشركة البلاد للإستشارات و الحلول ويحتوي على أهم النقاط ذات الصلة بالنسبة للمستخدم. يمكنك قراءة سياسة الخصوصية الكاملة هنا
                </Typography>
                <br></br>
                <b>جمع المعلومات</b>
                <br></br>
                <strong>نقوم بجمع معلومات معينة</strong>
                <Typography gutterBottom>
                    <ul className={classes.ul}>
                        <li>عند التسجيل في هذا الموقع.</li>
                        <li>من متصفح الويب الخاص بك.</li>
                        <li>من ملفات تعريف الارتباط (الكوكيز) التي قد نرسلها لجهاز الكمبيوتر الخاص بك لتخزين اختياراتك على موقعنا.</li>
                        <li>المعلومات الاختيارية، التي تقدمها عند تحميل أو تنزيل المحتوى من الموقع.</li>
                    </ul>
                </Typography>
                <br></br>
                <b>استخدام المعلومات</b>
                <br></br>
                <strong>قد نستخدم المعلومات الخاصة بك:</strong>
                <Typography gutterBottom>
                    <ul className={classes.ul}>
                        <li>لنرسل لك الرسائل الإدارية وتحديثات البريد الالكتروني بخصوص الموقع</li>
                    </ul>
                </Typography>
                <br></br>
                <b>الإفصاح</b>
                <Typography gutterBottom>
                    قد تقوم شركة البلاد بالكشف عن المعلومات الخاصة بك في الظروف المحددة المذكورة في هذه السياسة. على سبيل المثال لسلطات إنفاذ القانون.
                </Typography>
                <br></br>
                <b>الأمن</b>
                <Typography gutterBottom>
                    بشكل عام تستخدم شركة البلاد أنظمة حماية الحاسبات مثل تشفير البيانات لحماية معلوماتك الشخصية
                </Typography>
                <br></br>
                <strong>اختياراتك</strong>
                <Typography gutterBottom>
                    <ul className={classes.ul}>
                        <li>يمكنك إيقاف تشغيل ملفات تعريف الارتباط (الكوكيز) في المتصفح الخاص بك</li>
                    </ul>
                </Typography>
                <br></br>
                <strong>اتصل بنا</strong>
                <Typography gutterBottom>
                    (info@al-bilad.sa) يمكنك التواصل معنا بخصوص الأسئلة المتعلقة بالخصوصية عبر البريد الإلكتروني
                </Typography>
                <br></br>
                <strong>الجمهور</strong>
                <Typography gutterBottom>
                    تنطبق هذه السياسة على جميع زوار موقعنا على الإنترنت (أنت أو من يمثلونك(
                </Typography>
                <br></br>
                <strong>الغرض من هذه السياسة</strong>
                <Typography gutterBottom>
                    شركة البلاد تحترم خصوصيتك وتأخذ حماية المعلومات الشخصية على محمل الجد. والغرض من هذه السياسة هو وصف الطريقة التي يتم بها جمع وتخزين واستخدام وحماية المعلومات التي يمكن أن تخص شخص طبيعي أو اعتباري معين، ويمكن استخدامها لتحديد هذا الشخص ("معلومات شخصية"(
                </Typography>
                <br></br>
                <p>المعلومات الشخصية</p>
                <Typography gutterBottom>
                    <ol className={classes.ul}>
                        <li>تتضمن بعض المعلومات التي يتم جمعها عند التسجيل وأية معلومات اختيارية قدمتها طواعية</li>
                        <li>لا تتضمن المعلومات الإحصائية غير الشخصية التي يتم جمعها وإعدادها من قبل شركة البلاد والمعلومات التي قدمتها طواعية في بيئة عامة مفتوحة.</li>
                    </ol>
                </Typography>
                <br></br>
                <strong>قبول شروط الاستخدام</strong>
                <Typography gutterBottom>
                    باستخدام هذا الموقع فإنك تقر أنك قرأت وفهمت، وقبلت، ومن ثم وافقت على الالتزام بهذه الشروط.
                </Typography>
                <br></br>
                <strong>جمع المعلومات</strong>
                <Typography gutterBottom>
                    <ol className={classes.ul}>
                        <li>عند التسجيل. بمجرد التسجيل على موقعنا فإنك لن تكون مجهولاً بالنسبة لنا إذ سوف تزودنا بمعلومات شخصية تتضمن:
                            <ul className={classes.ul}>
                                <li>الاسم و اللقب – معلومات شخصية أخرى (إلزامية)</li>
                                <li>عنوان البريد الإلكتروني – معلومات تواصل أخرى (إلزامية)</li>
                                <li>مستندات شخصية</li>
                                <li>اسم مستخدم مميز وكلمة المرور – معلومات مصادقة أخرى (إلزامية).</li>
                            </ul>
                        </li>
                        <li> نحن نتلقى تلقائيا ونسجل معلومات استخدام الإنترنت الخاصة بك ("معلومات الاستخدام")</li>
                        <li>الكوكيز. عند الوصول إلى موقعنا على الانترنت قد نرسل واحد أو أكثر من ملفات تعريف الارتباط (الكوكيز) إلى جهاز الكمبيوتر الخاص بك لجمع معلومات استخدام معينة. نحن نستخدم المعلومات التي يتم جمعها من قبل الكوكيز لتحسين الموقع.</li>
                        <li>تفاصيل اختيارية. تستطيع تقديم معلومات على أساس طوعي "معلومات اختيارية" ويشمل ذلك المحتوى أو المستند الذي تقرر رفعه إلى موقعنا أو تحميله منه أو استخدام أي ميزات اختيارية ضمن وظائف الموقع.</li>
                        <li>هدف جمع المعلومات. قد تستخدم شركة البلاد أية معلومات اختيارية لأغراض معينة يتم إيضاحها للمستخدم في الوقت الذي يوافق فيه على تقديم هذه المعلومات.</li>
                    </ol>
                </Typography>
                <br></br>
                <strong>الموافقة على جمع المعلومات</strong>
                <Typography gutterBottom>
                    سنحصل على موافقة خاص منك لجمع المعلومات الشخصية:
                    <ul className={classes.ul}>
                        <li>وفقا للقوانين المعمول بها.</li>
                        <li>في الوقت الذي تقدم لنا فيه أي معلومات اختيارية</li>
                    </ul>
                </Typography>
                <br></br>
                <strong>الاستخدام</strong>
                <Typography gutterBottom>
                    الرسائل والتحديثات. قد نرسل لك رسائل التحديثات الإدارية والبريد الالكتروني بخصوص الموقع
                </Typography>
                <br></br>
                <strong>الإفصاح</strong>
                <Typography gutterBottom>
                    <ol className={classes.ul}>
                        <li> المشاركة. نحن لا نشارك معلوماتك الشخصية مع أي طرف.</li>
                        <li> أغراض التسويق. قد نكشف إحصائيات مجمعة عن المعلومات الشخصية للمعلنين أو الشركاء التجاريين.</li>
                        <li> إنفاذ القانون قد تكشف شركة البلاد المعلومات الشخصية إذا لزم الأمر:
                            <ul className={classes.ul}>
                                <li>بطلب من المحكمة</li>
                                <li>امتثالاً للقانون</li>
                            </ul>
                        </li>
                        <li>تغيير الملكية. عند حدوث تغيير في ملكية الشركة بالإندماج أو الاستحواذ أو بيع الأصول لكيان آخر، فإن شركة البلاد قد تحول حقوقها في المعلومات الشخصية التي تقوم بجمعها إلى مالك أو مشتري الجديد، أو كيان منفصل آخر. وسوف يتم الكشف عن عملية النقل على الموقع. وبإمكانك إذا كنت تشعر بالقلق إزاء نقل معلوماتك الشخصية إلى مالك جديد أن تطلب من شركة البلاد حذف معلوماتك الشخصية لديها</li>
                        <li>الموظفين. قد يتم الكشف عن معلوماتك الشخصية لموظفينا يتطلب عملهم الوصول إلى هذه المعلومات.</li>
                    </ol>
                </Typography>
                <br></br>
                <strong>أمن المعلومات الشخصية</strong>
                <Typography gutterBottom>
                    بشكل عام تستخدم شركة البلاد أنظمة حماية الحاسبات مثل الجدران النارية firewalls وتشفير البيانات encryption لحماية معلوماتك الشخصية.
                </Typography>
                <br></br>
                <strong>الاحتفاظ المعلومات الشخصية</strong>
                <Typography gutterBottom>
                    سوف نحتفظ فقط بأي معلومات شخصية قدمتها للمدة التي تتحقق فيها الأغراض المذكورة في في هذه السياسة، إلا إذا
                    <ul className={classes.ul}>
                        <li>كان الإبقاء على المعلومات مطلوباً بسلطة القانون</li>
                        <li>كنت قد وافقت على الإبقاء على السجل</li>
                    </ul>
                </Typography>
                <br></br>
                <strong>حدود</strong>
                <Typography gutterBottom>
                    شركة البلاد لا تعطي ضمانات وليست ملزمة بتقديم أية تعهدات أو التزام تجاه سياسة الخصوصية أو الممارسات الخاصة بأية مواقع مرتبطة أو خاصة بطرف ثالث.
                </Typography>
                <br></br>
                <strong>الاستفسارات</strong>
                <Typography gutterBottom>
                    إذا كانت لديك أية أسئلة أو استفسارات بشأن سياسة الخصوصية هذه أو الطريقة التي يمكننا التعامل بها مع المعلومات الشخصية، يرجى الاتصال بنا.
                </Typography>
            </DialogContent>
            <DialogActions>
                <button autoFocus onClick={handleClose} className="btn btn-primary ">
                    {t('common.ok')}
                </button>
            </DialogActions>
        </Dialog>
    )
}

export default PrivayPolicyDailog;