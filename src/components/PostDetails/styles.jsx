import { makeStyles } from '@mui/styles';

// styles.js
export default makeStyles((theme) => ({
  loadingPaper: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    padding: '20px', borderRadius: '15px', height: '39vh',
  },
  card: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
  section: {
    borderRadius: '20px',
    margin: '10px',
    flex: 1,
  },
  imageSection: {
    marginLeft: '20px',
    flex: 1, // يأخذ نصف المساحة في الشاشات الكبيرة
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  media: {
    borderRadius: '20px',
    objectFit: 'cover',
    width: '100%',
    maxHeight: '500px',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
  },
  // --- قسم المنشورات المقترحة المحسن ---
  recommendedContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '20px',
    marginTop: '20px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  recommendedCard: {
    flex: '1 1 200px', // يجعل الكروت مرنة (تنمو وتتقلص) بحد أدنى 200px
    padding: '15px',
    borderRadius: '15px',
    border: '1px solid #ebebeb',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0px 10px 20px rgba(0,0,0,0.05)',
    },
  },
  recImage: {
    width: '100%',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '10px',
  }
}));