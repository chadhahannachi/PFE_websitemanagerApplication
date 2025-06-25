import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import BusinessIcon from '@mui/icons-material/Business';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import WidgetsIcon from '@mui/icons-material/Widgets';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CategoryIcon from '@mui/icons-material/Category';
import HandshakeIcon from '@mui/icons-material/Handshake';
import GroupsIcon from '@mui/icons-material/Groups';
import TranslateIcon from '@mui/icons-material/Translate';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CookieIcon from '@mui/icons-material/Cookie';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import InfoIcon from '@mui/icons-material/Info';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [userName, setUserName] = useState("Utilisateur");
  const [userRole, setUserRole] = useState("Rôle");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.sub;
          const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserName(response.data.nom);
          setUserRole(response.data.role);
        } catch (error) {
          console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMINIS
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img alt="profile-user" width="100px" height="100px" src={`../../assets/avatar.png`} style={{ cursor: "pointer", borderRadius: "50%" }}/>
              </Box>
              <Box textAlign="center">
                <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}> {userName} </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}> {userRole} </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Manage Team"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          
            {userRole === "superadminabshore" && (
              <>
                <Item
                  title="Entreprises"
                  to="/EntrepriseManager"
                  icon={<BusinessIcon/>}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}
            {/* <Item
              title="Contacts Information"
              to="/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices Balances"
              to="/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            <Item
              title="My Company"
              to="/mycompany"
              icon={<MapsHomeWorkIcon />}
              selected={selected}
              setSelected={setSelected}
            />

{userRole === "superadminabshore" && (
              <Item
                title="Create User Form"
                to="/registration"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}

            {userRole === "superadminentreprise" && (
              <Item
                title="Add Member"
                to="/AddMemberByAdminEnt"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>

            
            
            
            

            <Item
              title="Pages"
              to="/pagesmanagement"
              icon={<NoteAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Slides"
              to="/slidesmanagement"
              icon={<VerticalSplitIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Services"
              to="/servicesmanagement"
              icon={<LocalOfferIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Solutions"
              to="/solutionsmanagement"
              icon={<EmojiObjectsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="Unités"
              to="/unitesmanagement"
              icon={<AccountBalanceWalletIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="Actualités"
              to="/actualitesmanagement"
              icon={<FiberNewIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="Evenements"
              to="/evenementmanagement"
              icon={<EventNoteIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="Articles"
              to="/articlesmanagement"
              icon={<CategoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Partenariats"
              to="/partenairesmanagement"
              icon={<HandshakeIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="Témoignages"
              to="/temoignagesmanagement"
              icon={<InterpreterModeIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="FAQ Page"
              to="/faqmanagement"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

<Item
              title="APropos Section"
              to="/aProposmanagement"
              icon={<InfoIcon/>}
              selected={selected}
              setSelected={setSelected}
            />


            <Item
              title="Languages Manager"
              to="/languages"
              icon={<TranslateIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Forms Manager"
              to="/forms"
              icon={<ListAltIcon />}
              selected={selected}
              setSelected={setSelected}
            />  
          
            <Item
              title="NavbarManager"
              to="/navbarmanager"
              icon={<HorizontalSplitIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
  
            <Item
              title="Menus"
              to="/menus"
              icon={<WidgetsIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Newsletters Manager"
              to="/newsletters"
              icon={<CardMembershipIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            
            <Item
              title="Cookies Manager"
              to="/cookiesmanagement"
              icon={<CookieIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Autres Types de données"
              to="/contenuSpecifiquemanagement"
              icon={<AccountTreeIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Gestion des Carroussels"
              to="/carrousselsmanagement"
              icon={<DynamicFeedIcon />}
              selected={selected}
              setSelected={setSelected}
            />


            
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;